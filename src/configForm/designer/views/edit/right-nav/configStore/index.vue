<template>
  <el-dialog class="dialog-container" :visible.sync="isShowDialog" title="配置数据仓库（store）" append-to-body>
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;">
      <div class="group">
        <el-form-item label="数据模型">
          <el-input
            v-model="data"
            type="textarea"
            rows="19"
            :class="invalidIndex !== '' ? 'error' : ''"
            placeholder="例如：{ 'grayPublish': null, 'name': 1 }"
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
      type: [Object, String],
      default: () => {}
    }
  },
  data() {
    return {
      isShowDialog: false,
      data: '',
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
    showDialog() {
      if (typeof this.value === 'object') {
        this.data = JSON.stringify(this.value, ' ', 2);
      } else {
        this.data = this.value;
      }
      this.invalidIndex = '';
      this.isShowDialog = true;
    },
    cancel() {
      this.data = '';
      this.isShowDialog = false;
      this.$emit('change', '');
      console.log('cancel');
    },
    ok() {
      let o = '';
      let valid = true;
      let curParseData = '';
      let curParseIndex = '';
      try {
        curParseData = this.data;
        curParseIndex = 1;
        o = JSON.parse(this.data);
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
