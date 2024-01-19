<template>
  <el-form-item
    :class="formTemplate.class"
    :prop="parentModelName + formTemplate.name"
    :required="!!+formTemplate.required"
    :rules="[
      ...(formTemplate.validateRules || []),
      { required: !!+formTemplate.required, message: formTemplate.label + '不能为空' }
    ]"
  >
    <template slot="label">
      {{ formTemplate.label }}
      <!-- 兼容泽明之前定义的规则（- -以后涉及这种通用组件的规则定义，命名尽量直观、符合语义点） -->
      <el-tooltip v-if="!!+formTemplate.isExplain" effect="light" placement="top">
        <div slot="content" v-html="formTemplate.isExplainTip"></div>
        <img v-if="!!+formTemplate.isExplain" :src="explainUrl" alt="" style="width: 16px" />
      </el-tooltip>
      <template v-else-if="formTemplate.labelTooltip">
        <el-tooltip v-bind="formTemplate.labelTooltip.$props">
          <div v-if="formTemplate.labelTooltip.tips" slot="content">
            <p v-for="(tip, i) in formTemplate.labelTooltip.tips" :key="i">{{ tip }}</p>
          </div>
          <img :src="explainUrl" alt="" style="width: 16px" />
        </el-tooltip>
      </template>
    </template>
    <el-radio-group v-model="model" :disabled="!!+formTemplate.disabled" v-on="onEvents">
      <el-radio v-for="(item, i) in options" :key="i" :label="item[fieldConfig.value]" :disabled="!!+item.disabled">
        {{ item[fieldConfig.key] }}
      </el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log("[radioGroup]：", ...args);
  }
};
export default {
  components: {},
  inject: ["getStore"],
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: Object,
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
      options: [], // 多选项数组
      defaultFieldConfig: {
        key: "label",
        value: "value"
      },
      insideModel: [],
      explainUrl: "" /*require('@src/assets/images/explain.png')*/
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    // options 选项列表的字段配置
    fieldConfig() {
      if (this.metadata && this.metadata.dataSource) {
        return this.metadata.dataSource.fieldConfig || this.defaultFieldConfig;
      }
      return this.defaultFieldConfig;
    },
    model: {
      get() {
        if (this.formTemplate.name) {
          return this.formModel[this.formTemplate.name];
        }
        return this.insideModel;
      },
      set(value) {
        if (this.formTemplate.name) {
          this.formModel[this.formTemplate.name] = value;
        }
        this.insideModel = value;
      }
    },
    coreProcessor() {
      return this.getStore()?.state()?.coreProcessor;
    },
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        events.change = this.handleEvent.bind(this, "change", this.metadata._id);
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    }
  },
  watch: {
    metadata: {
      handler: function (newV) {
        this.parseMetadata();
      },
      immediate: true
    },
    "metadata.dataSource": {
      handler: async function (newV, oldV) {
        const data = await this.coreProcessor.parseDataSource(newV);
        this.options = data || [];
        this.defaultFirstOption();
      }
    }
  },
  methods: {
    async parseMetadata() {
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      log("validateMetadata() return true");
      // 解析元数据
      const { dataSource } = this.metadata;
      this.options = await this.coreProcessor.parseDataSource(dataSource);
      this.options = this.options || [];
      this.defaultFirstOption();
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== "object") {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { dataSource } = this.metadata;
      if (!dataSource || typeof dataSource !== "object") {
        console.error("radioGroup 表单组件的 dataSource 字段不能为空");
        return false;
      }
      return true;
    },
    handleEvent(event, _id, eventData) {
      this.$emit("event", event, _id, eventData);
    },
    defaultFirstOption() {
      if (!!+this.formTemplate.isSelectFirst && !this.model && this.options?.length) {
        const key = this.formTemplate.dataSource?.fieldConfig?.value || "value";
        this.model = this.options[0][key];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
