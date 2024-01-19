<template>
  <el-form
    :label-width="formTemplate.labelWidth"
    :model="formModel"
    :class="formTemplate.class"
    :style="{ ...formTemplate.style }"
    :rules="formTemplate.validateRules"
  >
    <data-container :metadata="metadata" :form-model="formModel" @event="handleComponentEvent">
      <template v-for="item in slots" #[item]="data">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </data-container>
  </el-form>
</template>

<script>
/**
 * 表单容器，将子组件包裹在 el-form 里
 */
import dataContainer from '../dataContainer';
export default {
  components: { dataContainer },
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
    },
    // 在 formModel 中，父级的字段名
    parentModelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
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
  methods: {
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit('event', ...args);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
