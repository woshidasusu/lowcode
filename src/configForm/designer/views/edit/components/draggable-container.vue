<template>
  <draggable
    v-model="dragComponents"
    force-fallback="true"
    group="components"
    animation="500"
    :move="onMove"
    @add="onAdd"
    @choose="onChoose"
    @update="onUpdate"
  >
    <div
      v-for="(item, i) in data"
      :key="item._id + '_' + i"
      class="drag-item-container"
      :type="item.type"
      :class="item._id === curEditComponentId ? 'selected' : ''"
    >
      <drag-component :data="item"></drag-component>
      <i v-if="item._id === curEditComponentId" title="删除" class="del el-icon-remove" @click="onRemove(i)"></i>
    </div>
  </draggable>
</template>

<script>
import dynamicStore from '@src/store/dynamic-store';
import draggable from 'vuedraggable';
import DragComponent from '../drag-components';
export default {
  components: {
    draggable,
    DragComponent
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dragComponents: []
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.curDragComponent', 'edit.curEditComponent', 'edit.uid']),
    curEditComponentId() {
      return this.curEditComponent?._id;
    }
  },
  watch: {
    data(newV) {
      if (newV.length !== this.dragComponents.length) {
        const data = [];
        newV.forEach(v => {
          data.push(JSON.parse(JSON.stringify(v)));
        });
        this.dragComponents = data;
      }
    }
  },
  async mounted() {},
  destroyed() {},
  methods: {
    onMove(e, originalEvent) {
      if (e.relatedRect.left === 40) {
        // 禁止拖拽到左侧组件列表区域
        return false;
      }
      if (e.to !== e.from) {
        // 先禁止容器组件内的子组件跟外部组件之间的拖拽
        return false;
      }
      return true;
    },
    // FIXME 容器内组件与外部相互拖拽时有问题
    onAdd(e) {
      console.log('onAdd() - newIndex：', e.newIndex, this.curDragComponent.type);
      const o = { _id: this.uid++, ...JSON.parse(JSON.stringify(this.curDragComponent)) };
      this.data.splice(e.newIndex, 0, o);
      this.editComponent(o);
    },
    // 暴露给外部调用
    onQuickAdd() {
      console.log('onQuickAdd', this.curDragComponent.type);
      this.dragComponents.push(this.curDragComponent);
      const o = { _id: this.uid++, ...JSON.parse(JSON.stringify(this.curDragComponent)) };
      this.data.push(o);
      this.editComponent(o);
    },
    onChoose(e) {
      console.log('onChoose() - index：', e.oldIndex);
      this.editComponent(this.data[e.oldIndex]);
    },
    editComponent(item) {
      this.curEditComponent = item;
    },
    onUpdate(e) {
      console.log('onUpdate() - newIndex：', e.newIndex, 'oldIndex：', e.oldIndex);
      const o = this.data.splice(e.oldIndex, 1)[0];
      this.data.splice(e.newIndex, 0, o);
    },
    onRemove(i) {
      console.log('onRemove() - i：', i);
      this.dragComponents.splice(i, 1);
      this.data.splice(i, 1);
      if (i > 0) {
        this.editComponent(this.data[i - 1]);
      } else if (this.data.length) {
        this.editComponent(this.data[0]);
      } else {
        this.curEditComponent = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.drag-item-container {
  padding: 6px 12px;
  border: 1px dashed #dcdcdc;
  cursor: pointer;
  position: relative;

  &.selected {
    border-color: #1989fa;
    border-width: 2px;
  }
  &:hover {
    border-color: #1989fa;
  }

  .del {
    position: absolute;
    color: red;
    top: 0px;
    right: -22px;
    font-size: 22px;
    z-index: 1;
  }
}
</style>
