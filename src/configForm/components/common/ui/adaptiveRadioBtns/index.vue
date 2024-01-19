<template>
  <adaptive-radio-btns
    v-model="model"
    :class="formTemplate.class"
    :style="formTemplate.style"
    :tab-list="options"
    v-bind="formTemplate.$props"
    :default-field-config="fieldConfig"
    v-on="onEvents"
  ></adaptive-radio-btns>
</template>

<script>
/**
 * 自適應的單選按鈕組
 *
 */
import AdaptiveRadioBtns from '@src/components/adaptiveRadioBtns';
export default {
  components: {
    AdaptiveRadioBtns
  },
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
    }
  },
  data() {
    return {
      options: [],
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
        this.defaultFirstOption();
      }
    }
  },
  methods: {
    async parseMetadata() {
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      // 解析元数据
      const { dataSource } = this.metadata;
      this.options = await this.coreProcessor.parseDataSource(dataSource);
      this.options = this.options || [];
      this.defaultFirstOption();
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { dataSource } = this.metadata;
      if (!dataSource || typeof dataSource !== 'object') {
        console.error('dataSource 字段不能为空', this.formTemplate);
        return false;
      }
      return true;
    },
    handleEvent(event, _id, eventData) {
      this.$emit('event', event, _id, eventData);
    },
    defaultFirstOption() {
      if (!!+this.formTemplate.isSelectFirst && !this.model && this.options?.length) {
        const key = this.formTemplate.dataSource?.fieldConfig?.value || 'value';
        this.model = this.options[0][key];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
