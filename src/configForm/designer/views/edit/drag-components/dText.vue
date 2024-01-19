<template>
  <span>{{ data.showValue || '(默认显示绑定的表单字段[' + data.name + ']值)' }}</span>
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
