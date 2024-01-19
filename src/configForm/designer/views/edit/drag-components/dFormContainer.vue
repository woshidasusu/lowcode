<template>
  <div class="task-container">
    <div class="title">表单容器（将子组件包裹在 el-form 里）</div>
    <draggable-container style="flex-grow: 1" :data="data.components"> </draggable-container>
  </div>
</template>

<script>
export default {
  components: { DraggableContainer: () => import('../components/draggable-container.vue') },
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
.task-container {
  min-height: 600px;
  display: flex;
  flex-direction: column;
}
</style>
