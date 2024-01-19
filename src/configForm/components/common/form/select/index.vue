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
      v-model="model"
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
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[select]：', ...args);
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
    model: {
      get() {
        if (this.formTemplate.name) {
          return this.formModel[this.formTemplate.name];
        }
        return this.insideModel;
      },
      set(value) {
        if (this.formTemplate.name) {
          this.formModel[this.formTemplate.name] = value;
        }
        this.insideModel = value;
      }
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
      this.$emit('event', event, _id, eventData);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
