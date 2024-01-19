<template>
  <div>
    <div class="title">多列容器（行对齐且自动补位）</div>
    <div class="column-container">
      <draggable-container style="flex-grow: 1" :data="data.components"></draggable-container>
    </div>
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
.column-container {
  min-height: 200px;
  display: flex;
  .item {
    width: 50%;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-right: 24px;
    }
  }
  .split {
    width: 1px;
    background: #dcdcdc;
    position: relative;
    left: -12px;
  }
}
</style>
