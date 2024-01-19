<template>
  <yl-search-bar
    :limit="formTemplate.limit"
    :model="formModel"
    :class="formTemplate.class"
    :style="{ ...formTemplate.style }"
    :width="formTemplate.width || '260px'"
    :show-clear="!!+formTemplate.showClear"
    v-bind="formTemplate.$props"
    v-on="onEvents"
  >
    <template v-for="(item, i) in components">
      <yl-search-item
        v-if="!+item.hidden && !+item.putAway"
        :key="item._id || item.prop || item.name || i"
        :prop="item.prop || item.name"
        :label="item.label"
        :width="item.width"
        :class="item.class"
        class="search-item-container"
        :style="{ ...item.style }"
      >
        <!-- <img
          v-if="item.putAway === 0"
          title="移除"
          class="delIcon"
          :src="require('@src/assets/images/icon_clear.png')"
          @click="putAwayItem(item)"
        /> -->
        <data-container
          style="width: 100%"
          :metadata="{ components: [{ ...item, label: '', width: '' }] }"
          :form-model="formModel"
          :parent-model-name="parentModelName"
          @event="handleComponentEvent"
        >
          <template v-if="$scopedSlots[item.slotName]" #[item.slotName]="data">
            <slot :name="item.slotName" v-bind="data"></slot>
          </template>
        </data-container>
      </yl-search-item>
    </template>
    <yl-search-item v-if="putAwayList.length" always-show-label label="添加筛选">
      <el-select value="" placeholder="请选择其他筛选项" @change="showPutAwayItem">
        <el-option v-for="(item, i) in putAwayList" :key="i" :label="item.label" :value="item"></el-option>
      </el-select>
    </yl-search-item>
  </yl-search-bar>
</template>

<script>
/**
 * 搜索栏容器，将子组件包裹在 yl-search-item 里
 */
import dataContainer from '../dataContainer';
export default {
  components: { dataContainer },
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    },
    // 在 formModel 中，父级的字段名
    parentModelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uid: 1
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        events.search = this.handleEvent.bind(this, 'search', this.metadata._id);
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    },
    putAwayList() {
      return this.formTemplate.components.filter(v => !!+v.putAway && !+v.hidden);
    },
    components() {
      const list = [...this.formTemplate.components];
      list.sort((a, b) => {
        if (a.sort === b.sort) {
          return 0;
        }
        return (a.sort || 0) - (b.sort || 0);
      });
      return this.uid && list;
    }
  },
  watch: {},
  methods: {
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit('event', ...args);
    },
    handleEvent(event, _id, eventData) {
      console.error(eventData);
      this.$emit('event', event, _id, eventData);
    },
    showPutAwayItem(item) {
      if (item) {
        item.sort = this.formTemplate.components?.length + this.uid++;
        item.putAway = 0;
        if (item._id) {
          this.$emit('event', 'show', item._id, item);
        }
      }
    },
    putAwayItem(item) {
      if (item) {
        item.putAway = 1;
        if (this.formModel && (item.prop || item.name)) {
          this.formModel[item.prop || item.name] = '';
        }
        if (item._id) {
          this.$emit('event', 'hidden', item._id, item);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.search-item-container {
  position: relative;

  &:hover {
    .delIcon {
      display: inline-block;
    }
  }
}
.delIcon {
  display: none;
  position: absolute;
  top: 4px;
  right: 2px;
  cursor: pointer;
  width: 16px;
  height: 16px;
}
</style>
