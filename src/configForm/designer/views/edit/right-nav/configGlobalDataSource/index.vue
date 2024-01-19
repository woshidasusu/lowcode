<template>
  <el-dialog class="dialog-container" :visible.sync="isShowDialog" title="配置全局数据源（dataSource）" append-to-body>
    <div>
      <a style="margin-bottom: 24px" class="add" @click.stop="onAdd">
        <i class=" el-icon-circle-plus-outline"></i>添加全局数据({{ data.length }})
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
        <template v-if="item.type === 'api'">
          <el-form-item label="接口地址(url)">
            <el-input v-model="item.url" placeholder="请输入接口地址"></el-input>
          </el-form-item>
          <el-form-item label="请求参数(params)">
            <div>
              <el-button type="text" @click="showParamDialog(item)">配置</el-button>
            </div>
            <div v-if="item.params && item.params.length" style="line-height: 20px;" v-html="item.params"></div>
          </el-form-item>
          <el-form-item label="取数字段(dataKey)">
            <el-input
              v-model="item.dataKey"
              placeholder="设置取数的字段，支持 . 连接符取内嵌字段，默认: data"
            ></el-input>
          </el-form-item>
          <el-form-item label="存储字段(saveKey)">
            <el-input
              v-model="item.saveKey"
              placeholder="设置存储在数据仓库上的字段，不设置时跳过该数据源处理"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="item.type === 'dataService'">
          <el-form-item label="函数名(serviceName)">
            <el-input v-model="item.serviceName" placeholder="设置需要调用的自定义函数名"></el-input>
          </el-form-item>
          <el-form-item label="存储字段(saveKey)">
            <el-input
              v-model="item.saveKey"
              placeholder="设置存储在数据仓库上的字段，不设置时跳过该数据源处理"
            ></el-input>
          </el-form-item>
        </template>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">移除配置</el-button>
      <el-button type="primary" @click="ok">应用配置</el-button>
    </span>
    <config-params
      :value="curEditHandle && curEditHandle.params"
      :visible.sync="isShowParamDialog"
      @change="curEditHandle.params = $event"
    ></config-params>
  </el-dialog>
</template>

<script>
import ConfigParams from '../configParams';
export default {
  components: { ConfigParams },
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
        api: '调接口取数(api)',
        dataService: '调用自定义函数(dataService)'
      },
      isShowDialog: false,
      isShowParamDialog: false,
      curEditHandle: null,
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
    showParamDialog(handle) {
      this.curEditHandle = handle;
      this.isShowParamDialog = true;
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
        type: 'api',
        dataKey: 'data',
        saveKey: '',
        saveType: 'store',
        url: '',
        params: [],
        serviceName: ''
      };
    },
    cancel() {
      this.data = [];
      this.isShowDialog = false;
      this.$emit('change', []);
      console.log('cancel');
    },
    ok() {
      const o = this.data.map(v => {
        const data = { ...v };
        if (!['api'].includes(data.type)) {
          delete data.params;
          delete data.url;
        }
        if (!['dataService'].includes(data.type)) {
          delete data.serviceName;
        }
        if (data.dataKey === '') {
          delete data.dataKey;
        }
        return data;
      });

      this.$emit('change', o);
      this.isShowDialog = false;
      console.log('ok', o);
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
  .del {
    position: relative;
    cursor: pointer;
    top: 6px;
    color: red;
    font-size: 22px;
  }
}
</style>
