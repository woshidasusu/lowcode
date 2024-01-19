<template>
  <div class="dynamic-container">
    <container
      v-for="(item, i) in containerMetadatas"
      :key="i"
      :metadata="item"
      :form-model="insideFormModel"
      @event="handleComponentEvent"
    >
      <template v-for="s in slots" #[s]="data">
        <slot :name="s" v-bind="data"></slot>
      </template>
    </container>
  </div>
</template>

<script>
/**
 * 基于 container 多列容器组件封装的行对齐且自动补位的容器，用于某些字段会动态显隐时，下一个字段自动补上位置的场景
 */
import Container from '../container';
const log = (...args) => {
  if (window.__debug_log__) {
    console.log('[dynamic-container]：', ...args);
  }
};
export default {
  components: {
    Container
  },
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
    return {};
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    columns() {
      return this.formTemplate.columns || 2;
    },
    containerMetadatas() {
      const components = this.formTemplate.components?.filter(v => !+v.hidden) || [];
      const rows = Math.ceil(components.length / this.columns);
      const result = [];
      for (let i = 0; i < rows; i++) {
        const comp = new Array(this.columns).fill([]);
        comp.forEach((v, j) => {
          const index = i * this.columns + j;
          comp[j] = [];
          if (index < components.length) {
            comp[j].push(components[index]);
          }
        });
        result.push({ ...this.formTemplate, _id: this.formTemplate._id + '_' + i, components: comp });
      }
      return result;
    },
    insideFormModel() {
      if (this.formTemplate.name) {
        return this.formModel[this.formTemplate.name];
      }
      return this.formModel;
    },
    slots() {
      return Object.keys(this.$scopedSlots);
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
      log('parseMetadata()', this.metadata);
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
      const { components } = this.metadata;
      if (!components || !components.length) {
        console.error('dynamic-container 表单组件的 components 字段不能为空');
        return false;
      }
      return true;
    },
    handleComponentEvent(...args) {
      this.$emit(...args);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
