<template>
  <el-radio-group v-model="value" :disabled="!!+data.disabled">
    <el-radio>选项1</el-radio>
    <el-radio>选项2</el-radio>
    <el-radio>选项3</el-radio>
    <el-radio>...</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
