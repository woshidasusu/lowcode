<template>
  <div style="height: inherit">
    <template v-for="(item, i) in formTemplate.components">
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
        v-bind="$attrs"
        :ref="item._id"
        :key="i"
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
</template>

<script>
/**
 * 数据容器，只用于给表单字段分组使用，没有任何容器排版能力
 * 如：task: {xx:'xx'}, task: [{xx:'xx'}]
 */
import ALL_COMPONENTS from "../../../../components";
export default {
  inject: ["getStore"],
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
      default: ""
    }
  },
  data() {
    return {
      ALL_COMPONENTS: ALL_COMPONENTS,
      initRulesMap: {},
      metadataMap: {},
      eventListenerMap: {}
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    slots() {
      return Object.keys(this.$scopedSlots);
    },
    insideFormModel() {
      let model = this.formModel;
      if (this.formTemplate.name) {
        model = this.formModel[this.formTemplate.name];
      }
      if (Array.isArray(model)) {
        // FIXME 写死 0 应该有问题
        return model[0];
      }
      return model;
    },
    coreProcessor() {
      return this.getStore()?.state()?.coreProcessor;
    },
    // 传给子集组件的表单字段全路径
    wholeModelName(i) {
      let name = this.parentModelName || "";
      if (this.formTemplate.name) {
        name += this.formTemplate.name;
        if (Array.isArray(this.formModel[this.formTemplate.name])) {
          // FIXME 写死 0 应该有问题
          name += "[0]";
        }
        name += ".";
      }
      return name;
    },
    isArrayContainer() {
      // 判断是否是作为数组容器的子项使用，通过表单字段路径是否有 [ 来判定
      return this.wholeModelName.indexOf("[") > -1;
    }
  },
  watch: {
    metadata: {
      handler: function (newV, oldV) {
        this.parseMetadata();
      },
      immediate: true
    }
  },
  methods: {
    parseMetadata() {
      if (this.isArrayContainer) {
        // 当作为数组子项场景时，激活当前组件元数据解析出来的各种信息
        if (this.metadata?.components) {
          const data = this.coreProcessor?.getInfoByParseComponents(this.metadata.components) || {};
          this.initRulesMap = data._initRulesMap;
          this.metadataMap = data._metadataMap;
          this.eventListenerMap = data._eventListenerMap;
          this.updateStoreData();
          this.coreProcessor?.handleInitRules(data);
        }
      } else {
        this.metadataMap = this.coreProcessor?.getMetadataMap();
      }
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      if (this.isArrayContainer) {
        this.updateStoreData();
      }
      this.$emit("event", ...args);
    },
    // 可暴露给外部调用的接口；当作为数组子项场景时，激活当前组件元数据解析出来的各种信息
    updateStoreData() {
      this.coreProcessor?.updateFormModelMap(Object.keys(this.metadataMap), this.insideFormModel);
      this.coreProcessor?.updateMetadataMap(this.metadataMap);
      this.coreProcessor?.updateEventListenerMap(this.eventListenerMap);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
