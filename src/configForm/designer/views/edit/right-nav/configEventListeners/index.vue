<template>
  <el-dialog
    width="960px"
    class="dialog-container"
    :visible.sync="isShowDialog"
    title="配置事件监听（eventListener）"
    append-to-body
  >
    <div>
      <a style="margin-bottom: 24px" class="add" @click.stop="onAdd">
        <i class=" el-icon-circle-plus-outline"></i>添加事件监听({{ data.length }})
      </a>
    </div>
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;">
      <div v-for="(item, i) in data" :key="i" class="group">
        <i title="删除" class="del el-icon-remove" @click="onRemove(i)"></i>
        <el-form-item label="监听事件">
          <el-select v-model="item.event" allow-create filterable placeholder="请输入监听的事件">
            <el-option key="change" label="change" value="change"> </el-option>
          </el-select>
        </el-form-item>
        <config-conditions
          ref="conditionRef"
          tip="（不设置条件时，事件回调后直接执行响应行为）"
          :data="item"
        ></config-conditions>
        <el-form-item label="事件响应行为">
          <div>
            <a class="add" @click.stop="onAddHandle(item.handles)">
              <i class=" el-icon-circle-plus-outline"></i>添加事件响应行为({{ item.handles.length }})
            </a>
          </div>
          <div v-for="(handle, i) in item.handles" :key="i" class="handle-container item-space">
            <el-select v-model="handle.type" style="width: 350px" placeholder="请选择">
              <el-option v-for="(value, key) in handleTypeMap" :key="key" :value="key" :label="value"></el-option>
            </el-select>
            <el-tooltip>
              <div slot="content">
                <template v-if="handle.type === 'updateModel'">
                  <p>更新表单模型字段：formModel[formModelKey] = eventData[eventDataKey]</p>
                  <p>
                    支持通过 , 连接符来更新多个字段 e.g: formModelKey = 'a,b' eventDataKey: 'a,b' => formModel.a =
                    eventData.a; formModel.b = eventData.b;
                  </p>
                  <p>
                    支持通过 . 连接符来更新内嵌字段 e.g: formModelKey = 'a.b.c' => formModel.a.b.c =
                    eventData[eventDataKey]
                  </p>
                  <p>
                    特殊场景：如果需要遍历数组更新子项对象上的字段，可以通过 : 连接符 e.g: formModelKey = 'a:b' =>
                    formModel.a.forEach(v => v.b = eventData[eventDataKey]);
                  </p>
                </template>
                <template v-if="handle.type === 'updateDataSource'">
                  <p>需要配置：</p>
                  <p>【必填】指定目标组件的元数据 _id</p>
                  <p>【可选】解析后的数据源挂载在元数据上的字段，不设置时跳过此处理</p>
                </template>
                <template v-if="['updateHidden', 'updateDisabled', 'updateRequired'].includes(handle.type)">
                  <p>当配置值来源(valueFrom)时，开关固定值(value)的配置将不会生效</p>
                </template>
              </div>
              <i style="font-size: 20px" class="el-icon-warning-outline"></i>
            </el-tooltip>
            <div class="handle-config">
              <template v-if="['updateDisabled', 'updateHidden', 'updateRequired'].includes(handle.type)">
                <el-input v-model="handle.targetFormItemId" placeholder="设置目标组件的id"></el-input>
                <el-switch v-model="handle.value" :active-value="1" :inactive-value="0"></el-switch>
                <el-button type="text" @click="showValueFromDialog(handle)">
                  配置值来源
                  <span v-if="handle.valueFrom && handle.valueFrom">(已设置)</span>
                </el-button>
              </template>
              <template v-if="handle.type === 'updateModel'">
                <el-input v-model="handle.formModelKey" placeholder="设置formModelKey"></el-input>
                <el-input v-model="handle.eventDataKey" placeholder="设置eventDataKey"></el-input>
              </template>
              <template v-if="handle.type === 'execFunction'">
                <el-input
                  v-model="handle.functionBody"
                  placeholder="请输入函数体代码，接收参数 args: { $event: eventData }"
                ></el-input>
              </template>
              <template v-if="handle.type === 'dataService'">
                <el-input v-model="handle.serviceName" style="width: 200px" placeholder="函数名"></el-input>
                <el-button type="text" @click="showParamDialog(handle)">
                  配置参数
                  <span v-if="handle.params && handle.params.length">(已设置)</span>
                </el-button>
              </template>
              <template v-if="handle.type === 'updateDataSource'">
                <el-input v-model="handle.targetFormItemId" placeholder="设置目标组件的id"></el-input>
                <el-input v-model="handle.saveKey" placeholder="设置数据挂载字段，不设置时跳过此处理"></el-input>
                <el-button type="text" @click="showDataSourceDialog(handle)">
                  配置数据源
                  <span v-if="handle.dataSource">(已设置)</span>
                </el-button>
              </template>
            </div>

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
        updateModel: '修改表单值(updateModel)',
        updateDisabled: '修改禁用状态(updateDisabled)',
        updateHidden: '修改显隐(updateHidden)',
        updateRequired: '修改必填状态(updateRequired)',
        updateDataSource: '修改指定组件的数据源(updateDataSource)',
        execFunction: '执行函数体代码(execFunction)',
        dataService: '调用自定义函数执行(dataService)'
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
        event: 'change',
        conditionType: 'every',
        conditions: [],
        handles: []
      };
    },
    getDefaultHandle() {
      return {
        type: 'updateModel',
        value: '',
        serviceName: '',
        formModelKey: '',
        eventDataKey: '',
        targetFormItemId: '',
        functionBody: '',
        params: [],
        dataSource: null,
        saveKey: ''
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
    showValueFromDialog(handle) {
      this.curEditHandle = handle;
      this.isShowValueFromDialog = true;
    },
    onDataSourceConfiged(data) {
      this.curEditHandle.dataSource = data;
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
            if (!['updateModel'].includes(data.type)) {
              delete data.formModelKey;
              delete data.eventDataKey;
            }
            if (!['execFunction'].includes(data.type)) {
              delete data.functionBody;
            }
            if (!['dataService'].includes(data.type)) {
              delete data.serviceName;
              delete data.params;
            }
            if (!['updateDataSource'].includes(data.type)) {
              delete data.dataSource;
              delete data.saveKey;
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
  >>> .default {
    .el-form-item__content {
      max-width: 100%;
      margin-left: 0;
    }
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
    border: 1px dashed #dcdfe6;
    padding: 6px 10px;
    padding-right: 24px;
    position: relative;

    > div {
      margin-bottom: 6px;
    }

    .handle-config {
      display: flex;
      align-items: center;

      > div {
        margin-right: 8px;
      }
    }

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
