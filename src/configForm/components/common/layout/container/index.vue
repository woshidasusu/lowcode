<template>
  <div
    class="container"
    :style="{ 'margin-left': formTemplate.labelWidth, width: formTemplate.width, ...formTemplate.style }"
  >
    <div
      v-for="(items, index) in columns"
      :key="index"
      class="column-container"
      :style="{
        width: itemWidth[index],
        ...itemStyle[index]
      }"
    >
      <template v-for="(item, i) in items">
        <!-- 第一版 slot 设计感觉不好用 -->
        <slot
          v-if="item._id && !+item.hidden"
          :name="'before' + item._id"
          v-bind="metadataMap['before' + item._id]"
          :form-model="insideFormModel"
        ></slot>
        <!-- 第二版 slot 排版位置直接根据元数据配置的位置即可 -->
        <template v-if="item.type === 'slot2'">
          <slot v-if="!+item.hidden" :name="item.slotName" v-bind="item" :form-model="insideFormModel"></slot>
        </template>
        <component
          :is="ALL_COMPONENTS[item.type] || ALL_COMPONENTS['element']"
          v-else-if="!+item.hidden"
          :ref="item._id"
          :key="'c' + index + i"
          :style="item.style"
          :metadata="item"
          :form-model="insideFormModel"
          :parent-model-name="wholeModelName"
          :type="item.type"
          @event="handleComponentEvent"
        >
          <template v-for="s in slots" #[s]="data">
            <slot :name="s" v-bind="data"></slot>
          </template>
        </component>
        <slot
          v-if="item._id && !+item.hidden"
          :name="'after' + item._id"
          v-bind="metadataMap['after' + item._id]"
          :form-model="insideFormModel"
        ></slot>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * 多列的表单组件
 * components 数组长度即为多列
 */
import ALL_COMPONENTS from '../../../../components';
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[container]：', ...args);
  }
};
export default {
  inject: ['getStore'],
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
      ALL_COMPONENTS: ALL_COMPONENTS
    };
  },
  computed: {
    // 各列数据
    columns() {
      if (this.metadata) {
        return this.metadata.components || [];
      }
      return [];
    },
    formTemplate() {
      return this.metadata || {};
    },
    insideFormModel() {
      if (this.formTemplate.name) {
        return this.formModel[this.formTemplate.name];
      }
      return this.formModel;
    },
    slots() {
      return Object.keys(this.$scopedSlots);
    },
    metadataMap() {
      return this.getStore()?.state()?.metadataMap || {};
    },
    itemWidth() {
      const itemWidths = [];
      const defaultWidth = `calc(${100 / this.columns.length}% - 30px)`;
      this.columns.forEach((v, i) => {
        if (this.formTemplate.itemWidth == null) {
          itemWidths.push(defaultWidth);
        } else if (Array.isArray(this.formTemplate.itemWidth)) {
          itemWidths.push(this.formTemplate.itemWidth[i]);
        } else {
          itemWidths.push(this.formTemplate.itemWidth);
        }
      });
      return itemWidths;
    },
    itemStyle() {
      return this.formTemplate.itemStyle || [];
    },
    // 传给子集组件的表单字段全路径
    wholeModelName(i) {
      let name = this.parentModelName || '';
      if (this.formTemplate.name) {
        name += this.formTemplate.name;
        if (Array.isArray(this.formModel[this.formTemplate.name])) {
          // FIXME 写死 0 应该有问题
          name += '[0]';
        }
        name += '.';
      }
      return name;
    }
  },
  watch: {
    metadata: {
      handler: function(newV) {
        this.parseMetadata();
      },
      immediate: true
    }
  },
  methods: {
    parseMetadata() {
      log('parseMetadata()', this.metadata);
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      log('validateMetadata() return true');
      // 解析元数据
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { components } = this.metadata;
      if (!components || !components.length) {
        console.error('container 表单组件的 components 字段不能为空');
        return false;
      }
      return true;
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit('event', ...args);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.container {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 24px;

  .column-container {
    flex-shrink: 0;

    &:not(:last-child) {
      margin-right: 30px;
    }
  }
}
</style>
