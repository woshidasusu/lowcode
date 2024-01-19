<template>
  <div class="right-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础配置">
        <el-form v-model="metadata">
          <el-form-item label="页面类型" prop="type">
            <el-select v-model="metadata.type" disabled style="width: 100%" placeholder="页面类型">
              <el-option label="表单页" value="formPage"></el-option>
              <el-option label="列表页" value="listPage"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签宽度(带单位)" prop="labelWidth">
            <el-input v-model="metadata.labelWidth" placeholder="标签宽度"></el-input>
          </el-form-item>
          <el-form-item v-if="metadata.store != null && metadata.store.state != null" label="数据仓库(store)">
            <a @click="showStoreDialog">编辑</a>
            <div>{{ metadata.store.state }}</div>
            <config-store v-model="metadata.store.state" :visible.sync="isShowStoreDialog"></config-store>
          </el-form-item>
          <el-form-item label="数据源">
            <a @click="showGlobalDataSourceDialog">
              编辑
              <span v-if="metadata.dataSource && metadata.dataSource.length">
                (已配置 {{ metadata.dataSource.length }} 个全局数据)
              </span>
            </a>
          </el-form-item>
          <el-form-item label="表单回填配置"> </el-form-item>
          <el-form-item label="底部按钮配置"> </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="curEditComponent" label="组件配置">
        <el-form v-model="curEditComponent">
          <el-form-item label="_id" style="margin-bottom: 0">
            <span>{{ curEditComponent._id }}</span>
            <config-id v-model="curEditComponent._id" class="edit-icon">
              <i class="el-icon-edit "></i>
            </config-id>
          </el-form-item>
          <el-form-item label="type" style="margin-bottom: 0">
            <span>{{ curEditComponent.type }}</span>
          </el-form-item>
          <el-form-item v-if="curEditComponent.label != null" label="标签(label)">
            <el-input v-model="curEditComponent.label" placeholder="label"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.label != null" label="标签宽度(labelWidth)">
            <el-input v-model="curEditComponent.labelWidth" placeholder="默认以基础配置里的标签宽度为主"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.width != null" label="宽度(width)">
            <el-input v-model="curEditComponent.width" placeholder="默认 100%"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.style != null" label="样式(style)">
            <a @click="showStyleDialog">编辑</a>
            <div>{{ curEditComponent.style }}</div>
          </el-form-item>
          <el-form-item v-if="curEditComponent.placeholder != null" label="placeholder">
            <el-input v-model="curEditComponent.placeholder" placeholder="默认取 label 字段自动拼接"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showValue != null" label="小标题(showValue)">
            <el-input v-model="curEditComponent.showValue" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.name != null" label="绑定表单字段(name)">
            <el-input v-model="curEditComponent.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.value != null" label="绑定表单字段的初始值">
            <el-input
              v-if="typeof curEditComponent.value === 'string'"
              v-model="curEditComponent.value"
              placeholder=""
            ></el-input>
            <div>
              <br />
              <div style="white-space: pre-wrap;line-height: 20px;" v-html="curEditComponent.value"></div>
            </div>
          </el-form-item>
          <el-form-item v-if="curEditComponent.tip != null" label="设置说明文案(tip)">
            <el-input v-model="curEditComponent.tip" placeholder="设置说明文案tip"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.required != null" label="是否必填(required)">
            <el-switch v-model="curEditComponent.required" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.hidden != null" label="是否隐藏(hidden)">
            <el-switch v-model="curEditComponent.hidden" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.disabled != null" label="是否禁用(disabled)">
            <el-switch v-model="curEditComponent.disabled" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.autosize != null" label="是否自适应高度(autosize)">
            <el-switch v-model="curEditComponent.autosize" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showPosition != null" label="是否显示关联部位操作(showPosition)">
            <el-switch v-model="curEditComponent.showPosition" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.cancelConfirm != null" label="取消勾选时是否二次弹窗确认">
            <el-switch v-model="curEditComponent.cancelConfirm" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.doubleConfirm != null" label="是否需要二次弹窗确认操作">
            <el-switch v-model="curEditComponent.doubleConfirm" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.multiple != null" label="是否多选(multiple)">
            <el-switch v-model="curEditComponent.multiple" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.isSelectFirst != null" label="默认选中第一项(isSelectFirst)">
            <el-switch v-model="curEditComponent.isSelectFirst" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.clearable != null" label="是否支持清空(clearable)">
            <el-switch v-model="curEditComponent.clearable" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showWordLimit != null" label="是否显示字数限制(showWordLimit)">
            <el-switch v-model="curEditComponent.showWordLimit" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showRegion != null" label="是否显示县区级数据(showRegion)">
            <el-switch v-model="curEditComponent.showRegion" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showWordLimit" label="限多少字(maxlength)">
            <el-input v-model="curEditComponent.maxlength" placeholder="限多少字"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.rows != null" label="行数(rows)">
            <el-input-number v-model="curEditComponent.rows"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.columns != null" label="列数(columns)">
            <el-input-number v-model="curEditComponent.columns" :min="2"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.type === 'inputNumber'" label="min">
            <el-input-number v-model="curEditComponent.min"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.type === 'inputNumber'" label="max">
            <el-input-number v-model="curEditComponent.max"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.format != null" label="日期显示格式化(format)">
            <el-input v-model="curEditComponent.format" placeholder="默认 yyyy-MM-dd HH:mm"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.valueFormat != null" label="日期值格式化(valueFormat)">
            <el-input v-model="curEditComponent.valueFormat" placeholder="默认 yyyy-MM-dd HH:mm"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.prefixIcon != null" label="左图标(prefixIcon)">
            <el-input v-model="curEditComponent.prefixIcon" placeholder="默认 el-icon-date"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.addText != null" label="添加按钮的文案(addText)">
            <el-input v-model="curEditComponent.addText" placeholder="默认根据 label 字段自动拼接"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.addTip != null" label="说明文案(addTip)">
            <el-input v-model="curEditComponent.addTip" placeholder=""></el-input>
          </el-form-item>
          <config-container v-if="curEditComponent.type === 'container'" :data="curEditComponent"></config-container>
          <config-image-uploader
            v-if="curEditComponent.type === 'imageUploader'"
            :data="curEditComponent"
          ></config-image-uploader>
          <config-user-selector
            v-if="curEditComponent.type === 'kf_user_selector'"
            :data="curEditComponent"
          ></config-user-selector>
          <config-object-select
            v-if="curEditComponent.type === 'objectSelect'"
            :data="curEditComponent"
          ></config-object-select>
          <config-data-container
            v-if="curEditComponent.type === 'dataContainer'"
            :data="curEditComponent"
          ></config-data-container>
          <el-form-item
            v-if="['element', 'slot', 'input', 'textarea'].includes(curEditComponent.type)"
            label="自定义配置($props)"
          >
            <a @click="showPropDialog">编辑</a>
            <div>{{ curEditComponent.$props }}</div>
          </el-form-item>
          <el-form-item v-if="dataSourceFieldNameMap[curEditComponent.type]" label="数据源(dataSource)">
            <a @click="showDataSourceDialog">
              编辑
              <span v-if="curEditComponent[dataSourceFieldNameMap[curEditComponent.type]]">
                (已配置, type: {{ curEditComponent[dataSourceFieldNameMap[curEditComponent.type]].type }})
              </span>
            </a>
          </el-form-item>
          <el-form-item label="初始化(initRules)">
            <a @click="showInitRulesDialog">
              编辑
              <span v-if="curEditComponent.initRules && curEditComponent.initRules.length">
                (已配置, 初始化规则列表{{ curEditComponent.initRules.length }}个)
              </span>
            </a>
          </el-form-item>
          <el-form-item label="监听事件(eventListener)">
            <a @click="showEventListenersDialog">
              编辑
              <span v-if="curEditComponent.eventListener && curEditComponent.eventListener.length">
                (已配置, 事件监听列表{{ curEditComponent.eventListener.length }}个)
              </span>
            </a>
          </el-form-item>
          <el-form-item label="表单校验(validateRules)">
            <a @click="showValidateRulesDialog">
              编辑
              <span v-if="curEditComponent.validateRules && curEditComponent.validateRules.length">
                (已配置, 校验规则列表{{ curEditComponent.validateRules.length }}个)
              </span>
            </a>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <template v-if="curEditComponent">
      <config-data-source
        v-if="dataSourceFieldNameMap[curEditComponent.type]"
        v-model="curEditComponent[dataSourceFieldNameMap[curEditComponent.type]]"
        :visible.sync="isShowDataSourceDialog"
      ></config-data-source>
      <config-init-rules v-model="curEditComponent.initRules" :visible.sync="isShowInitRulesDialog"></config-init-rules>
      <config-event-listeners
        v-model="curEditComponent.eventListener"
        :visible.sync="isShowEventListenersDialog"
      ></config-event-listeners>
      <config-validate-rules
        v-model="curEditComponent.validateRules"
        :visible.sync="isShowValidateRulesDialog"
      ></config-validate-rules>
      <config-style v-model="curEditComponent.style" :visible.sync="isShowStyleDialog"></config-style>
      <config-prop v-model="curEditComponent.$props" :visible.sync="isShowPropDialog"></config-prop>
    </template>
    <config-global-data-source
      v-if="metadata.dataSource"
      v-model="metadata.dataSource"
      :visible.sync="isShowGlobalDataSourceDialog"
    ></config-global-data-source>
  </div>
</template>

<script>
import dynamicStore from '@src/store/dynamic-store';
import ConfigDataSource from './configDataSource';
import ConfigGlobalDataSource from './configGlobalDataSource';
import ConfigInitRules from './configInitRules';
import ConfigEventListeners from './configEventListeners';
import ConfigValidateRules from './configValidateRules';
import ConfigContainer from './configContainer';
import ConfigDataContainer from './configDataContainer';
import ConfigStyle from './configStyle';
import ConfigStore from './configStore';
import ConfigProp from './configProp';
import ConfigId from './configId';
import ConfigImageUploader from './configImageUploader';
import ConfigUserSelector from './configUserSelector';
import ConfigObjectSelect from './configObjectSelect';
export default {
  components: {
    ConfigDataSource,
    ConfigGlobalDataSource,
    ConfigInitRules,
    ConfigEventListeners,
    ConfigValidateRules,
    ConfigContainer,
    ConfigDataContainer,
    ConfigStyle,
    ConfigImageUploader,
    ConfigStore,
    ConfigProp,
    ConfigId,
    ConfigUserSelector,
    ConfigObjectSelect
  },
  props: {},
  data() {
    return {
      activeTab: '0',
      isShowDataSourceDialog: false,
      isShowGlobalDataSourceDialog: false,
      isShowInitRulesDialog: false,
      isShowEventListenersDialog: false,
      isShowValidateRulesDialog: false,
      isShowStyleDialog: false,
      isShowStoreDialog: false,
      isShowPropDialog: false,
      dataSourceFieldNameMap: {
        checkboxGroup: 'dataSource',
        radioGroup: 'dataSource',
        search: 'dataSource',
        select: 'dataSource'
      }
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.metadata', 'edit.curEditComponent'])
  },
  watch: {
    curEditComponent(newV) {
      if (newV) {
        this.activeTab = '1';
      } else {
        this.activeTab = '0';
      }
    }
  },
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    showStyleDialog() {
      this.isShowStyleDialog = true;
    },
    showStoreDialog() {
      this.isShowStoreDialog = true;
    },
    showPropDialog() {
      this.isShowPropDialog = true;
    },
    showDataSourceDialog() {
      this.isShowDataSourceDialog = true;
    },
    showGlobalDataSourceDialog() {
      this.isShowGlobalDataSourceDialog = true;
    },
    showInitRulesDialog() {
      this.isShowInitRulesDialog = true;
    },
    showEventListenersDialog() {
      this.isShowEventListenersDialog = true;
    },
    showValidateRulesDialog() {
      this.isShowValidateRulesDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
a {
  cursor: pointer;
}
.right-container {
  position: fixed;
  top: 75px;
  right: 20px;
  width: 330px;
  bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 13px 0 #ebeef5;
  overflow: auto;

  >>> .el-form-item {
    margin-bottom: 8px;
  }
}
.group-container {
  border-top: 1px solid #ebeef5;
  padding: 15px 0;
  font-size: 15px;
  font-weight: bold;
  color: #333333;
}
.border-top {
  border-top: 1px solid #dcdfe6;
}

.desc {
  font-size: 14px;
  color: #999999;
  padding: 0 14px;
}
.edit-icon {
  margin-left: 16px;
  color: #409eff;
  cursor: pointer;
}
</style>
