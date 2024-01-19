<template>
  <div class="task-container">
    <div class="title">数据容器（只用于给字段分组，没有容器排版能力）</div>
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
