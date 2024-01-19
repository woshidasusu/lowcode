<template>
  <el-dialog
    class="dialog-container"
    :visible.sync="isShowDialog"
    title="配置表单校验规则（validateRules）"
    append-to-body
  >
    <div>
      <a style="margin-bottom: 24px" class="add" @click.stop="onAdd">
        <i class=" el-icon-circle-plus-outline"></i>添加校验规则({{ data.length }})
      </a>
    </div>
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;">
      <div v-for="(item, i) in data" :key="i" class="group">
        <i title="删除" class="del el-icon-remove" @click="onRemove(i)"></i>
        <el-form-item label="校验规则">
          <el-input
            v-model="data[i]"
            :class="invalidIndex === i ? 'error' : ''"
            placeholder="参考 element-ui 的 validate，例如：{ required: true, message: 'xxx不能为空' }"
          >
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">移除配置</el-button>
      <el-button type="primary" @click="ok">应用配置</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShowDialog: false,
      data: [],
      invalidIndex: ''
    };
  },

  computed: {},
  watch: {
    visible(newV) {
      if (newV) {
        this.showDialog();
      }
    },
    isShowDialog(newV) {
      this.$emit('update:visible', newV);
    }
  },
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    onAdd() {
      this.data.push(this.getDefaultConfig());
    },
    onRemove(i) {
      this.data.splice(i, 1);
    },
    showDialog() {
      if (Array.isArray(this.value)) {
        this.data = JSON.parse(JSON.stringify(this.value)).map(v => {
          return JSON.stringify(v);
        });
      } else {
        this.data = [];
      }
      this.invalidIndex = '';
      this.isShowDialog = true;
    },
    getDefaultConfig() {
      return JSON.stringify({ required: true, message: 'xxx不能为空' });
    },
    cancel() {
      this.data = [];
      this.isShowDialog = false;
      this.$emit('change', []);
      console.log('cancel');
    },
    ok() {
      // 过滤没有设置初始化行为的数据
      let o = [];
      let valid = true;
      let curParseData = '';
      let curParseIndex = '';
      try {
        o = this.data.map((v, i) => {
          curParseData = v;
          curParseIndex = i;
          return JSON.parse(v);
        });
      } catch (error) {
        this.invalidIndex = curParseIndex;
        valid = false;
      }
      if (!valid) {
        this.$message.error(`【${curParseData}】格式错误，JSON.parse 转换失败`);
        return;
      }
      this.$emit('change', o);
      console.log('ok', o);
      this.isShowDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.dialog-container {
  >>> .el-form-item__label {
    max-width: 120px;
    line-height: 20px;
    word-break: break-word;
    text-align: left;
    padding-top: 7px;
  }
  >>> .el-form-item__content {
    margin-left: 120px;
    max-width: calc(100% - 160px);
  }
  .add {
    font-size: 14px;
    cursor: pointer;
    i {
      font-size: 16px;
      margin-right: 4px;
    }
  }

  .group {
    padding: 10px 24px;
    border: 1px dashed #dcdfe6;
    margin-bottom: 14px;
    position: relative;
    .del {
      position: absolute;
      cursor: pointer;
      color: red;
      top: 0px;
      right: 0px;
      font-size: 22px;
    }
  }

  .desc {
    color: #999999;
  }

  >>> .el-input.error {
    input {
      border-color: red;
    }
  }
}
</style>
