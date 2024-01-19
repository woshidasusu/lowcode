<template>
  <div style="margin-bottom: 24px">
    <div class="title-container">
      <img :src="require('./images/icon_title_line.png')" />
      <span class="title">{{ formTemplate.showValue }}</span>
    </div>
    <div class="split-line"></div>
  </div>
</template>

<script>
/**
 {
      type: 'title',
      id: '唯一标识符',
      showValue: '基础信息'
}
 */
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[title]：', ...args);
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
  computed: {
    formTemplate() {
      return this.metadata || {};
    }
  },
  watch: {
    metadata: {
      handler: function (newV) {
        this.parseMetadata();
      },
      immediate: true
    }
  },
  methods: {
    // 解析元数据
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
      const { showValue } = this.metadata;
      if (!showValue) {
        console.error('title 表单组件的 showValue 字段不能为空');
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

.title-container {
  margin-bottom: 12px;
  display: flex;
  align-items: center;

  img {
    height: 15px;
    margin-right: 8px;
  }

  .title {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }
}
.split-line {
  height: 1px;
  background: #ebeef5;
}
</style>
