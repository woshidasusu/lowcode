<template>
  <el-dialog
    v-if="dataSource"
    class="dialog-container"
    :visible.sync="isShowDialog"
    title="配置数据源（dataSource）"
    append-to-body
  >
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;" :model="dataSource">
      <el-form-item label="类型(type)">
        <el-select v-model="dataSource.type" style="width: 300px" placeholder="请选择">
          <el-option v-for="(value, key) in typeDescMap" :key="key" :value="key" :label="value"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="dataSource.type === 'template'">
        <el-form-item label="数据(options)">
          <div>
            <a class="add" @click.stop="onAddTemplateOption">
              <i class=" el-icon-circle-plus-outline"></i>添加({{ dataSource.options.length }})
            </a>
          </div>
          <div v-for="(item, i) in dataSource.options" :key="i" class="row-container">
            <el-input v-model="item.label" placeholder="请输入数据显示的文本 label"></el-input>
            <el-input v-model="item.value" placeholder="请输入数据的 id"></el-input>
            <i title="删除" class="del el-icon-remove" @click="onRemoveTemplateOption(i)"></i>
          </div>
        </el-form-item>
      </template>
      <template v-if="dataSource.type === 'api'">
        <el-form-item label="接口地址(url)">
          <el-input v-model="dataSource.url" placeholder="请输入接口地址"></el-input>
        </el-form-item>
        <el-form-item label="请求参数(params)">
          <div>
            <el-button type="text" @click="isShowParamDialog = true">配置</el-button>
          </div>
          <div
            v-if="dataSource.params && dataSource.params.length"
            style="line-height: 20px;"
            v-html="dataSource.params"
          ></div>
        </el-form-item>
        <el-form-item label="取数字段(dataKey)">
          <el-input
            v-model="dataSource.dataKey"
            placeholder="设置取数的字段，支持 . 连接符取内嵌字段，默认: data"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据源为对象数组时的字段映射(fieldConfig)">
          <div class="row-container">
            <el-input v-model="dataSource.fieldConfig.key" placeholder="设置key字段名，默认label"></el-input>
            <el-input v-model="dataSource.fieldConfig.value" placeholder="设置value字段名，默认value"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="dataSource.type === 'window'">
        <el-form-item label="取数字段(dataKey)">
          <el-input
            v-model="dataSource.dataKey"
            placeholder="设置取数的字段，支持 . 连接符取内嵌字段，默认: data"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据源为对象数组时的字段映射(fieldConfig)">
          <div class="row-container">
            <el-input v-model="dataSource.fieldConfig.key" placeholder="设置key字段名，默认label"></el-input>
            <el-input v-model="dataSource.fieldConfig.value" placeholder="设置value字段名，默认value"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="['formModel'].includes(dataSource.type)">
        <el-form-item label="取数字段(dataKey)">
          <el-input
            v-model="dataSource.dataKey"
            placeholder="设置取数的字段，支持 . 连接符取内嵌字段，默认: data"
          ></el-input>
        </el-form-item>
        <el-form-item label="取数的表单模型对象来源(targetFormId)">
          <div style="display: flex;align-items: center">
            <el-tooltip>
              <div slot="content">
                <p>不设置时，默认从整个表单模型(formModel)取数；</p>
                <p>可设置从指定组件所挂载的表单模型上取数</p>
                <p>
                  通常用于数组内的组件场景，此时组件 id
                  一致，但所挂载的内嵌表单模型不一样，是数组内各个表单项，所以此时可通过该配置设置当前组件 id
                </p>
                <p>当前组件id：{{ curEditComponent._id }}</p>
              </div>
              <i style="font-size: 20px" class="el-icon-warning-outline"></i>
            </el-tooltip>
            <el-input
              v-model="dataSource.targetFormId"
              placeholder="不设置时，默认从整个表单模型(formModel)取数"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="数据源为对象数组时的字段映射(fieldConfig)">
          <div class="row-container">
            <el-input v-model="dataSource.fieldConfig.key" placeholder="设置key字段名，默认label"></el-input>
            <el-input v-model="dataSource.fieldConfig.value" placeholder="设置value字段名，默认value"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="['eventContext'].includes(dataSource.type)">
        <el-form-item label="取数字段(dataKey)">
          <el-input
            v-model="dataSource.dataKey"
            placeholder="默认返回整个事件上下文数据，支持 . 连接符取内嵌字段"
          ></el-input>
        </el-form-item>
      </template>
      <template v-if="dataSource.type === 'pageUrl'">
        <el-form-item label="取数字段(dataKey)">
          <el-input v-model="dataSource.dataKey" placeholder="设置地址携带的参数名，默认: data"></el-input>
        </el-form-item>
      </template>
      <template v-if="dataSource.type === 'store'">
        <el-form-item label="取数字段(dataKey)">
          <el-input
            v-model="dataSource.dataKey"
            placeholder="设置取数的字段，支持 . 连接符取内嵌字段，默认: data"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据源为对象数组时的字段映射(fieldConfig)">
          <div class="row-container">
            <el-input v-model="dataSource.fieldConfig.key" placeholder="设置key字段名，默认label"></el-input>
            <el-input v-model="dataSource.fieldConfig.value" placeholder="设置value字段名，默认value"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="dataSource.type === 'dataService'">
        <el-form-item label="函数名(serviceName)">
          <el-input v-model="dataSource.serviceName" placeholder="设置需要调用的自定义函数名"></el-input>
        </el-form-item>
        <el-form-item label="设置传参(params)">
          <div>
            <el-button type="text" @click="isShowParamDialog = true">配置</el-button>
          </div>
          <div
            v-if="dataSource.params && dataSource.params.length"
            style="line-height: 20px;"
            v-html="dataSource.params"
          ></div>
        </el-form-item>
        <el-form-item label="数据源为对象数组时的字段映射(fieldConfig)">
          <div class="row-container">
            <el-input v-model="dataSource.fieldConfig.key" placeholder="设置key字段名，默认label"></el-input>
            <el-input v-model="dataSource.fieldConfig.value" placeholder="设置value字段名，默认value"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="dataSource.type === 'constant'">
        <el-form-item label="返回固定值(value)">
          <el-input v-model="dataSource.value" placeholder="设置需要返回的固定值"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">移除配置</el-button>
      <el-button type="primary" @click="ok">应用配置</el-button>
    </span>
    <config-params
      v-if="dataSource.params"
      v-model="dataSource.params"
      :visible.sync="isShowParamDialog"
    ></config-params>
  </el-dialog>
</template>

<script>
import dynamicStore from '@src/store/dynamic-store';
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
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      typeDescMap: {
        template: '从元数据上取数(template)',
        api: '调接口取数(api)',
        formModel: '从表单数据取数(formModel)',
        pageUrl: '从页面链接取数(pageUrl)',
        constant: '返回固定值(constant)',
        dataService: '调用自定义函数(dataService)',
        eventContext: '事件上下文取数(eventContext)',
        store: '从数据仓库取数(store)',
        window: '从全局对象上取数(window)'
      },
      isShowDialog: false,
      isShowParamDialog: false,
      dataSource: null
    };
  },

  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.curEditComponent'])
  },
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
    onAddTemplateOption() {
      this.dataSource.options.push({ label: '', value: '' });
    },
    onRemoveTemplateOption(i) {
      this.dataSource.options.splice(i, 1);
    },
    showDialog() {
      const data = this.value || {};
      this.dataSource = Object.assign(this.getDefaultConfig(), JSON.parse(JSON.stringify(data)));
      this.isShowDialog = true;
    },
    getDefaultConfig() {
      return {
        type: 'template',
        options: [],
        dataKey: '',
        saveKey: '',
        fieldConfig: {
          key: 'label',
          value: 'value'
        },
        url: '',
        method: '',
        params: [],
        symbol: '',
        value: '',
        targetFormId: ''
      };
    },
    cancel() {
      this.dataSource = null;
      this.isShowDialog = false;
      this.$emit('change', null);
      console.log('cancel');
    },
    ok() {
      const o = {};
      Object.keys(this.dataSource).forEach(key => {
        if (this.dataSource[key]) {
          o[key] = this.dataSource[key];
        }
      });
      if (!['api', 'dataService'].includes(o.type)) {
        delete o.params;
      }
      if (!['template'].includes(o.type)) {
        delete o.options;
      }
      if (['constant'].includes(o.type)) {
        delete o.fieldConfig;
        if (o.value === undefined) {
          o.value = '';
        }
      }
      if (!['formModel'].includes(o.type)) {
        delete o.targetFormId;
      }
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
