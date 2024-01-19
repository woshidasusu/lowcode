<template>
  <div v-loading="loading">
    <data-container :metadata="{ components: components }" :form-model="formModel" @event="handleComponentEvent">
      <template v-for="item in slots" #[item]="data">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </data-container>
  </div>
</template>

<script>
import CoreProcessor from './core';
import DataContainer from './components/common/layout/dataContainer';

/**
 * 配置化-列表页
 */
const debug = false;
const log = (...args) => {
  if (debug) {
    console.log('[listPage]：', ...args);
  }
};
export default {
  components: { DataContainer },
  inject: ['getStore'],
  props: {
    // 解析完 formModel 数据模型后触发，参数会传入 formModel 对象，可以对数据模型操作，来处理一些初始化工作
    afterParseFormModel: {
      type: Function,
      default: () => undefined
    }
  },
  data() {
    return {
      loading: false,
      metadata: null,
      components: [],
      formModel: {}
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    slots() {
      return Object.keys(this.$scopedSlots);
    }
  },
  watch: {},
  async mounted() {
    this.metadata = this.getStore()?.state()?.metadata;
    this.parseMetadata();
  },
  destroyed() {},
  methods: {
    // 解析元数据
    async parseMetadata() {
      if (!this.metadata) {
        return;
      }
      this.loading = true;
      log('parseMetadata()', this.metadata);
      // 先校验元数据格式的合法性
      if (!this.validateMetadata()) {
        this.loading = false;
        return;
      }
      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      // 解析获取数据模型
      this.formModel = await coreProcessor.parseFormModel(this.metadata.components);
      if (this.afterParseFormModel) {
        await this.afterParseFormModel(this.formModel);
      }
      await coreProcessor.parseComponents(this.metadata.components);
      await coreProcessor.parseGlobalConfig(this.metadata);

      // 处理表单组件的初始化规则
      coreProcessor.handleInitRules();
      log('parseFormModel()', this.formModel);

      // 渲染表单组件
      this.components = this.metadata.components;
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      if (!this.metadata.components || !this.metadata.components.length) {
        // components 数组为空时，中断后续处理
        return false;
      }
      log('validateMetadata() - return true');
      return true;
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(event, formItemId, eventData) {
      log('handleComponentEvent()', { event, formItemId, eventData });
      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      coreProcessor.handleComponentEvent(event, formItemId, eventData);
      this.$emit('event', event, formItemId, eventData);
    },
    // 暴露给外部使用的方法
    getFormModel() {
      return this.formModel;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
