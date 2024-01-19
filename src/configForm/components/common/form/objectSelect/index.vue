<template>
  <el-form-item
    :label="formTemplate.label"
    :prop="parentModelName + formTemplate.name"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="[
      ...(formTemplate.validateRules || []),
      { required: !!+formTemplate.required, message: formTemplate.label + '不能为空' }
    ]"
  >
    <el-select
      v-model="insideModel"
      :style="{ width: formTemplate.width || '100%' }"
      :placeholder="formTemplate.placeholder || `请选择${formTemplate.label || ''}`"
      :multiple="!!+formTemplate.multiple"
      :disabled="!!+formTemplate.disabled"
      :clearable="!!+formTemplate.clearable"
      :filterable="!!+formTemplate.filterable"
      v-bind="formTemplate.$props"
      size="medium"
      v-on="onEvents"
    >
      <el-option
        v-for="(item, i) in options"
        :key="i"
        :label="item[fieldConfig.key]"
        :value="item[fieldConfig.value]"
        :disabled="!!+item.disabled"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
/**
 * 对象下拉框，与 select 区别就是该组件绑定的数据是对象类型，而不在是字符串。多选时，绑定的就是对象数组
 */
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[objectSelect]：', ...args);
  }
};
export default {
  inject: ['getStore'],
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 在 formModel 中，父级的字段名
    parentModelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [], // 多选项数组
      defaultFieldConfig: {
        key: 'label',
        value: 'value'
      },
      insideModel: ''
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    // options 选项列表的字段配置
    fieldConfig() {
      if (this.metadata && this.metadata.dataSource) {
        return this.metadata.dataSource.fieldConfig || this.defaultFieldConfig;
      }
      return this.defaultFieldConfig;
    },
    model() {
      if (this.formTemplate.name) {
        return this.formModel[this.formTemplate.name];
      }
      return [];
    },
    coreProcessor() {
      return this.getStore()?.state()?.coreProcessor;
    },
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        events.change = this.handleEvent.bind(this, 'change', this.metadata._id);
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    },
    optionItemMap() {
      const map = {};
      this.options.forEach(v => (map[v[this.fieldConfig.value]] = v));
      return map;
    },
    // 选中后绑定的对象内的字段映射
    fieldConfigInSelected() {
      return {
        id: this.formTemplate.fieldConfig?.id || 'id',
        name: this.formTemplate.fieldConfig?.name || 'name'
      };
    }
  },
  watch: {
    metadata: {
      handler: function(newV) {
        this.parseMetadata();
      },
      immediate: true
    },
    'metadata.dataSource': {
      handler: async function(newV, oldV) {
        const data = await this.coreProcessor.parseDataSource(newV);
        this.options = data || [];
      }
    },
    model: {
      handler: function(newV) {
        if (Array.isArray(newV)) {
          this.insideModel = newV.map(v => v[this.fieldConfigInSelected.id]);
        } else if (typeof newV === 'object') {
          this.insideModel = newV && newV[this.fieldConfigInSelected.id];
        }
      },
      immediate: true
    }
  },
  methods: {
    async parseMetadata() {
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      log('validateMetadata() return true');
      // 解析元数据
      const { dataSource } = this.metadata;
      this.options = await this.coreProcessor.parseDataSource(dataSource);
      this.options = this.options || [];
      let isSelectFirst = !!+this.metadata.isSelectFirst;
      if (dataSource.isSelectFirst != null) {
        // 兼容旧版设计
        isSelectFirst = !!+dataSource.isSelectFirst;
      }
      if (isSelectFirst && this.options.length && !this.model) {
        this.model = this.options[0][this.fieldConfig.value];
      }
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { dataSource } = this.metadata;
      if (!dataSource || typeof dataSource !== 'object') {
        console.error('select 表单组件的 dataSource 字段不能为空');
        return false;
      }
      return true;
    },
    handleEvent(event, _id, eventData) {
      let data = eventData;
      if (Array.isArray(eventData)) {
        data = data.map(v => {
          return {
            ...this.optionItemMap[v],
            [this.fieldConfigInSelected.id]: this.optionItemMap[v][this.fieldConfig.value],
            [this.fieldConfigInSelected.name]: this.optionItemMap[v][this.fieldConfig.key]
          };
        });
      } else if (eventData && typeof eventData === 'string') {
        data = {
          ...this.optionItemMap[eventData],
          [this.fieldConfigInSelected.id]: this.optionItemMap[eventData][this.fieldConfig.value],
          [this.fieldConfigInSelected.name]: this.optionItemMap[eventData][this.fieldConfig.key]
        };
      }
      if (this.formTemplate.name) {
        this.formModel[this.formTemplate.name] = data;
      }
      this.$emit('event', event, _id, data);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
