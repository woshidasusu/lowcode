<template>
  <div>
    <i class="icon el-icon-circle-plus-outline"></i>
    <a class="add-btn">{{ data.addText || `添加${data.label}` }}</a
    ><span v-if="data.addTip" class="tips">{{ data.addTip }}</span>
  </div>
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

<style lang="scss" scoped>
.icon {
  color: #1f93ff;
  font-size: 22px;
  cursor: pointer;
  position: relative;
  top: 3px;
}
.add-btn {
  color: #1f93ff;
  margin-left: 8px;
  cursor: pointer;
}
.tips {
  color: #999999;
}
</style>
