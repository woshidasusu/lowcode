<template>
  <el-dialog class="dialog-container" :visible.sync="isShowDialog" title="配置参数（param）" append-to-body>
    <div>
      <a style="margin-bottom: 24px" class="add" @click.stop="onAdd">
        <i class=" el-icon-circle-plus-outline"></i>添加({{ data.length }})
      </a>
    </div>
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;">
      <div v-for="(item, i) in data" :key="i" class="group">
        <i title="删除" class="del el-icon-remove" @click="onRemove(i)"></i>
        <el-form-item label="类型(type)">
          <el-select v-model="item.type" style="width: 300px" placeholder="请选择">
            <el-option v-for="(value, key) in typeDescMap" :key="key" :value="key" :label="value"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="item.type === 'pageUrl'">
          <el-form-item label="参数字段名(key)">
            <el-input v-model="item.key" placeholder="请输入参数字段名"></el-input>
          </el-form-item>
        </template>
        <template v-if="item.type === 'constant'">
          <el-form-item label="参数({key:value})">
            <div class="row-container">
              <el-input v-model="item.key" placeholder="请输入参数键值 key"></el-input>
              <el-input v-model="item.value" placeholder="请输入参数值 value"></el-input>
            </div>
          </el-form-item>
        </template>
        <template v-if="item.type === 'formModel'">
          <el-form-item label="参数字段名(key)">
            <el-input v-model="item.key" placeholder="请输入参数字段名"></el-input>
          </el-form-item>
          <el-form-item label="取数字段(dataKey)">
            <el-input
              v-model="item.dataKey"
              placeholder="设置取数的字段，支持 . 连接符取内嵌字段，默认: data，支持 . 连接符取内嵌字段"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="item.type === 'eventContext'">
          <el-form-item label="参数字段名(key)">
            <el-input v-model="item.key" placeholder="请输入参数字段名"></el-input>
          </el-form-item>
          <el-form-item label="取数字段(dataKey)">
            <el-input
              v-model="item.dataKey"
              placeholder="默认返回整个事件上下文数据，支持 . 连接符取内嵌字段"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="item.type === 'dataService'">
          <el-form-item label="函数名(serviceName)">
            <el-input
              v-model="item.serviceName"
              placeholder="设置需要调用的自定义函数名，需返回对象类型数据"
            ></el-input>
          </el-form-item>
        </template>
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
      typeDescMap: {
        pageUrl: '从页面地址上读取参数(pageUrl)',
        constant: '固定值参数(constant)',
        formModel: '从表单数据上读取(formModel)',
        dataService: '调用自定义函数(dataService)',
        eventContext: '从事件上下文参数里取数(eventContext)'
      },
      isShowDialog: false,
      data: []
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
        this.data = JSON.parse(JSON.stringify(this.value));
      } else {
        this.data = [];
      }
      this.isShowDialog = true;
    },
    getDefaultConfig() {
      return {
        type: 'pageUrl',
        key: '',
        value: ''
      };
    },
    cancel() {
      this.data = [];
      this.isShowDialog = false;
      this.$emit('change', []);
      console.log('cancel');
    },
    ok() {
      // 过滤没有设置 key 值的数据
      const o = this.data
        .filter(v => {
          return v.key;
        })
        .map(v => {
          const data = { ...v };
          if (data.type !== 'constant') {
            delete data.value;
          }
          return data;
        });
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
  .row-container {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 6px;

    > div {
      &:not(:last-child) {
        margin-right: 12px;
      }
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
}
</style>
