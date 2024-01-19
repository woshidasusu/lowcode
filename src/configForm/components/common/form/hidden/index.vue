<template>
  <input v-model="model" type="hidden" />
</template>

<script>
/**
 * hidden 类型的表单
 * <input type="hidden"/>
 *
 * 可用于一些无需渲染，但又需要配置表单字段的场景
 */

const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[hidden]：', ...args);
  }
};
export default {
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
    }
  },
  watch: {
    metadata: {
      handler: function(newV) {
        this.parseMetadata();
      },
      immediate: true
    }
  },
  methods: {
    parseMetadata() {
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      log('validateMetadata() return true');
      // 解析元数据
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { name } = this.metadata;
      if (!name) {
        console.error('hidden 表单组件的 name 字段不能为空');
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
