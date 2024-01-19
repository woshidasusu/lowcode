<template>
  <el-select
    :style="{ width: data.width || '100%' }"
    width="100%"
    right-icon="search"
    :placeholder="data.placeholder || `请选择${data.label || ''}`"
    :disabled="!!+data.disabled"
    size="medium"
  >
  </el-select>
</template>

<script>
export default {
  components: { },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  async mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
