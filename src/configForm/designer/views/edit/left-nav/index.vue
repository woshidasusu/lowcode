<template>
  <div class="left-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="全部" name="全部">
        <div v-for="(item, i) in components" :key="i" class="components-container">
          <div class="title">{{ item.name }}</div>
          <draggable
            v-model="item.components"
            chosen-class="chosen"
            force-fallback="true"
            filter=".disabled"
            animation="500"
            :options="{ group: { name: 'components', pull: 'clone' }, sort: true }"
            :move="onMove"
          >
            <div v-for="(comp, j) in item.components" :key="j" title="按住左键拖拽" class="item">
              <i class="el-icon-circle-plus-outline disabled" title="单击快速添加" @click.stop="quickAdd(comp)"></i>
              {{ comp.__nameShowInDesigner }} <span style="white-space: nowrap;">（ {{ comp.type }} ）</span>
            </div>
          </draggable>
        </div>
      </el-tab-pane>
      <el-tab-pane v-for="(item, i) in components" :key="i" :label="item.name" :name="item.name">
        <div class="components-container">
          <draggable
            v-model="item.components"
            chosen-class="chosen"
            force-fallback="true"
            filter=".disabled"
            animation="500"
            :options="{ group: { name: 'components', pull: 'clone' }, sort: true }"
            :move="onMove"
          >
            <div v-for="(comp, j) in item.components" :key="j" title="按住左键拖拽" class="item">
              <i class="el-icon-circle-plus-outline disabled" title="单击快速添加" @click.stop="quickAdd(comp)"></i>
              {{ comp.__nameShowInDesigner }} <span style="white-space: nowrap;">（ {{ comp.type }} ）</span>
            </div>
          </draggable>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import components from '../../../metadata';
import draggable from 'vuedraggable';
import dynamicStore from '@src/store/dynamic-store';
export default {
  components: { draggable },
  props: {},
  data() {
    return {
      activeTab: '全部',
      components: JSON.parse(JSON.stringify(components)),
      lastDragDiv: null
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.curDragComponent'])
  },
  watch: {},
  async mounted() {},
  destroyed() {},
  methods: {
    onMove(e, originalEvent) {
      if (e.relatedRect.left === 40) {
        // 禁止掉左边组件列表区域的拖拽
        return false;
      }
      const containerTypes = ['container'];
      if (
        e.to.id === 'mainDraggableContainer' &&
        containerTypes.includes(e.originalEvent.target.getAttribute('type'))
      ) {
        // 当拖到组件在容器区域时，禁止掉最外层区域的拖拽，否则会造成上下反复滑动
        return false;
      }
      if (this.lastDragDiv !== e.dragged) {
        this.lastDragDiv = e.dragged;
        this.updateCurDragComponent(e.draggedContext.element);
      }
      return true;
    },
    onEnd(e) {
      console.log('onEnd', e);
    },
    onClone(e) {
      console.log('onClone', e);
    },
    quickAdd(data) {
      data = JSON.parse(JSON.stringify(data));
      this.updateCurDragComponent(data);
      this.$emit('quickAdd', data);
    },
    updateCurDragComponent(data) {
      const o = {};
      Object.keys(data).forEach(key => {
        if (!key.startsWith('__')) {
          o[key] = data[key];
        }
      });
      this.curDragComponent = o;
      console.log('updateCurDragComponent', this.curDragComponent);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.left-container {
  position: fixed;
  top: 75px;
  left: 20px;
  width: 360px;
  bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 13px 0 #ebeef5;
  overflow: auto;
  user-select: none;

  >>> .el-form-item {
    margin-bottom: 12px;
  }
}
.components-container {
  border-bottom: 1px solid #ebeef5;
  .title {
    font-size: 15px;
    font-weight: bold;
    color: #333333;
    padding: 15px 0;
  }
  .item {
    cursor: move;
    line-height: 30px;
    margin-bottom: 12px;
    width: 100%;
    font-size: 14px;
    border: 1px solid #d8d8d8;
    padding: 0px 8px;
    border-radius: 4px;

    &:hover {
      background: #d8d8d8;
    }

    i {
      cursor: pointer;
      font-size: 20px;
      padding: 0px 4px;
      position: relative;
      top: 2px;
      color: #1989fa;
    }
  }
}
</style>
