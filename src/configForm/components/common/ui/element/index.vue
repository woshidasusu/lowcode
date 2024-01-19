<template>
  <component :is="metadata.type" :ref="metadata._id" v-bind="metadata.$props" v-model="model" v-on="onEvents">
    <template v-for="(item, i) in metadata.components">
      <element-ui
        v-if="!+item.hidden"
        :key="'c' + i"
        :metadata="item"
        :form-model="insideFormModel"
        @event="handleEvent"
      >
      </element-ui>
    </template>
  </component>
</template>

<script>
/**
 * 支持直接配置 element-ui 组件的 props 来进行渲染
 * $props: 配置输入
 * name: 自动 v-model 双向绑定
 * 【示例】
 */
// const debug = window.__debug_log__;
// const log = (...args) => {
//   if (debug) {
//     console.log('[element]：', ...args);
//   }
// };
export default {
  name: 'ElementUi',
  inject: ['getStore'],
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      insideModel: ''
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
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
    insideFormModel() {
      if (this.formTemplate.name) {
        return this.formModel[this.formTemplate.name];
      }
      return this.formModel;
    },
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    }
  },
  watch: {},
  methods: {
    handleEvent(event, formItemId, eventData) {
      this.$emit('event', event, formItemId, eventData);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
