<template>
  <el-form-item :label="formTemplate.label" :label-width="formTemplate.labelWidth" :required="!!+formTemplate.required">
    <audio-list :list="model" :field-config="fieldConfig" :style="{ width: formTemplate.width || '100%' }"></audio-list>
  </el-form-item>
</template>

<script>
/**
 * 语音文件显示组件
 */

import AudioList from '@src/components/audioList';

const log = (...args) => {
  if (window.__debug_log__) {
    console.log('[audioList]：', ...args);
  }
};
export default {
  components: {
    AudioList
  },
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
      insideModel: []
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    model: {
      get() {
        if (this.formTemplate.name) {
          return this.formModel[this.formTemplate.name] || [];
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
    fieldConfig() {
      return {
        src: 'src',
        suffix: 'suffix',
        ...this.metadata?.fieldConfig
      };
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
