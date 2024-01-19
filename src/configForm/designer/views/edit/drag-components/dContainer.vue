<template>
  <div>
    <div class="title">多列容器</div>
    <div class="column-container">
      <template v-for="(item, i) in data.components">
        <div :key="i" class="item">
          <draggable-container style="flex-grow: 1" :data="item"></draggable-container>
        </div>
        <div v-if="i < data.components.length - 1" :key="'s' + i" class="split"></div>
      </template>
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
