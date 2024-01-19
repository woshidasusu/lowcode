<template>
  <el-dialog
    width="950px"
    class="dialog-container"
    :visible.sync="isShowDialog"
    title="配置初始化规则（initRules）"
    append-to-body
  >
    <div>
      <a style="margin-bottom: 24px" class="add" @click.stop="onAdd">
        <i class=" el-icon-circle-plus-outline"></i>添加初始化规则({{ data.length }})
      </a>
    </div>
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;">
      <div v-for="(item, i) in data" :key="i" class="group">
        <i title="删除" class="del el-icon-remove" @click="onRemove(i)"></i>
        <config-conditions ref="conditionRef" :data="item"></config-conditions>
        <el-form-item label="初始化行为">
          <div>
            <a class="add" @click.stop="onAddHandle(item.handles)">
              <i class=" el-icon-circle-plus-outline"></i>添加初始化行为({{ item.handles.length }})
            </a>
          </div>
          <div v-for="(handle, i) in item.handles" :key="i" class="handle-container item-space">
            <el-select v-model="handle.type" placeholder="请选择">
              <el-option v-for="(value, key) in handleTypeMap" :key="key" :value="key" :label="value"></el-option>
            </el-select>
            <el-tooltip>
              <div slot="content">
                <template v-if="['disabled', 'hidden', 'required'].includes(handle.type)">
                  <p>当配置值来源(valueFrom)时，开关固定值(value)的配置将不会生效</p>
                </template>
              </div>
              <i style="font-size: 20px" class="el-icon-warning-outline"></i>
            </el-tooltip>
            <template v-if="['disabled', 'hidden', 'required'].includes(handle.type)">
              <el-switch v-model="handle.value" :active-value="1" :inactive-value="0"></el-switch>
              <el-button type="text" @click="showValueFromDialog(handle)">
                配置值来源
                <span v-if="handle.valueFrom && handle.valueFrom">(已设置)</span>
              </el-button>
            </template>
            <template v-if="handle.type === 'model'">
              <el-button type="text" @click="showDataSourceDialog(handle)">
                配置表单值
                <span v-if="handle.dataSource">(已设置)</span>
              </el-button>
            </template>
            <template v-if="handle.type === 'dataService'">
              <el-input v-model="handle.serviceName" style="width: 200px" placeholder="函数名"></el-input>
              <el-button type="text" @click="showParamDialog(handle)">
                配置参数
                <span v-if="handle.params && handle.params.length">(已设置)</span>
              </el-button>
            </template>
            <i title="删除" class="del el-icon-remove" @click="onRemoveHandle(item.handles, i)"></i>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">移除配置</el-button>
      <el-button type="primary" @click="ok">应用配置</el-button>
    </span>

    <config-params
      :visible.sync="isShowParamDialog"
      :value="curEditHandle && curEditHandle.params"
      @change="onParamConfiged"
    ></config-params>
    <config-data-source
      :visible.sync="isShowDataSourceDialog"
      :value="curEditHandle && curEditHandle.dataSource"
      @change="onDataSourceConfiged"
    ></config-data-source>
    <config-value-from
      :visible.sync="isShowValueFromDialog"
      :value="curEditHandle && curEditHandle.valueFrom"
      @change="onValueFromConfiged"
    ></config-value-from>
  </el-dialog>
</template>

<script>
import ConfigParams from '../configParams';
import ConfigDataSource from '../configDataSource';
import ConfigValueFrom from '../configValueFrom';
import ConfigConditions, { removeInvalidConditionConfig } from '../configConditions';
export default {
  components: { ConfigParams, ConfigDataSource, ConfigConditions, ConfigValueFrom },
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
      handleTypeMap: {
        model: '初始化表单值(model)',
        disabled: '初始化禁用(disabled)',
        hidden: '初始化显隐(hidden)',
        required: '初始化必填(required)',
        dataService: '调用自定义函数进行初始化(dataService)'
      },
      isShowDialog: false,
      data: [],
      curEditHandle: null,
      isShowParamDialog: false,
      isShowDataSourceDialog: false,
      isShowValueFromDialog: false
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
    onAddHandle(handles) {
      handles.push(this.getDefaultHandle());
    },
    onRemoveHandle(handles, i) {
      handles.splice(i, 1);
    },
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
        conditionType: 'every',
        conditions: [],
        handles: []
      };
    },
    getDefaultHandle() {
      return {
        type: 'model',
        value: '',
        dataSource: null,
        serviceName: '',
        params: []
      };
    },
    showParamDialog(handle) {
      this.curEditHandle = handle;
      this.isShowParamDialog = true;
    },
    onParamConfiged(params) {
      this.curEditHandle.params = params;
    },
    showDataSourceDialog(handle) {
      this.curEditHandle = handle;
      this.isShowDataSourceDialog = true;
    },
    onDataSourceConfiged(data) {
      this.curEditHandle.dataSource = data;
    },
    showValueFromDialog(handle) {
      this.curEditHandle = handle;
      this.isShowValueFromDialog = true;
    },
    onValueFromConfiged(data) {
      this.curEditHandle.valueFrom = data;
      if (!data) {
        delete this.curEditHandle.valueFrom;
      }
    },
    cancel() {
      this.data = [];
      this.isShowDialog = false;
      this.$emit('change', []);
      console.log('cancel');
    },
    ok() {
      // 过滤没有设置初始化行为的数据
      const o = this.data
        .filter(v => {
          return v.handles?.length > 0;
        })
        .map(v => {
          const data = { ...v };
          data.handles = data.handles.map(h => {
            const data = { ...h };
            if (!data.params?.length) {
              delete data.params;
            }
            if (!data.dataSource) {
              delete data.dataSource;
            }
            if (!data.serviceName) {
              delete data.serviceName;
            }
            if (data.value === '') {
              delete data.value;
            }
            return data;
          });
          removeInvalidConditionConfig(data);
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

  .desc {
    color: #999999;
  }

  .handle-container {
    position: relative;
    .del {
      top: 5px;
    }

    &:hover {
      background: #f0f0f0;
    }
  }
}

.item-space {
  > div,
  > a,
  > span {
    &:not(:last-child) {
      margin-right: 12px;
    }
  }

  &:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
