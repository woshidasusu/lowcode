<template>
  <el-form-item :label="formTemplate.label" :label-width="formTemplate.labelWidth" :required="!!+formTemplate.required">
    <!-- TODO 后续增加字段映射 -->
    <file-list :list="model" :style="{ width: formTemplate.width || '100%' }"></file-list>
  </el-form-item>
</template>

<script>
/**
 * 文件列表显示组件
 */

import FileList from '@src/components/fileList/fileList';

const log = (...args) => {
  if (window.__debug_log__) {
    console.log('[fileList]：', ...args);
  }
};
export default {
  components: {
    FileList
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
