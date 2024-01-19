<template>
  <el-tabs
    v-model="activeTab"
    :stretch="!!+formTemplate.stretch"
    @tab-click="handleComponentEvent('tab-click', formTemplate._id, $event)"
  >
    <el-tab-pane
      v-for="(tab, k) in tabList"
      :key="k"
      :label="tab.label"
      :name="tab.nativeName"
      :disabled="!!+tab.disabled"
      :lazy="!!+tab.lazy"
    >
      <template v-for="(item, i) in tab.components">
        <!-- 第一版 slot 设计感觉不好用 -->
        <slot
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
          :key="'tc' + i"
          :style="item.style"
          :metadata="item"
          :form-model="insideFormModel"
          :type="item.type"
          @event="handleComponentEvent"
        ></component>
        <slot :name="'after' + item._id" v-bind="metadataMap['after' + item._id]" :form-model="insideFormModel"></slot>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/**
 * tabs 容器组件
 * components 数组长度即为 tab 的数量，每个子项还是个数组，里面是当前 tab 渲染的组件
 */
import ALL_COMPONENTS from "../../../../components";
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log("[tabs]：", ...args);
  }
};
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
    }
  },
  data() {
    return {
      ALL_COMPONENTS: ALL_COMPONENTS,
      activeTab: ""
    };
  },
  computed: {
    tabList() {
      return this.metadata?.components?.filter(v => !+v.hidden) || [];
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
    metadataMap() {
      return this.getStore()?.state()?.metadataMap || {};
    },
    coreProcessor() {
      return this.getStore()?.state()?.coreProcessor;
    }
  },
  watch: {
    metadata: {
      handler: function (newV) {
        this.parseMetadata();
      },
      immediate: true
    }
  },
  methods: {
    parseMetadata() {
      log("parseMetadata()", this.metadata);
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      log("validateMetadata() return true");
      // 解析元数据
      this.activeTab = this.metadata.value || this.tabList[0]?.nativeName;
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== "object") {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { components } = this.metadata;
      if (!components || !components.length) {
        console.error("tabs 表单组件的 components 字段不能为空");
        return false;
      }
      return true;
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit("event", ...args);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
