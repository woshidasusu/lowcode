<template>
  <el-form-item
    :label="formTemplate.label"
    :prop="parentModelName + formTemplate.name"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="[
      ...(formTemplate.validateRules || []),
      { required: !!+formTemplate.required, message: formTemplate.label + '不能为空' }
    ]"
  >
    <el-select
      v-model="model"
      :style="{ width: formTemplate.width || '100%' }"
      width="100%"
      right-icon="search"
      :init-data="initData"
      :label="fieldConfig.key || 'name'"
      :value="fieldConfig.value || 'id'"
      :remote-method="callRemoteMethod"
      :placeholder="formTemplate.placeholder || `请选择${formTemplate.label || ''}`"
      :multiple="!!+formTemplate.multiple"
      :disabled="!!+formTemplate.disabled"
      :clearable="!!+formTemplate.clearable"
      v-bind="formTemplate.$props"
      size="medium"
      v-on="onEvents"
    ></el-select>
  </el-form-item>
</template>

<script>
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log("[search]：", ...args);
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
      defaultFieldConfig: {
        key: "id",
        value: "name"
      },
      insideModel: "",
      initData: []
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
        events.selected = this.handleEvent.bind(this, "change", this.metadata._id);
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
    model: {
      handler: function (newV) {
        const nameField = this.formTemplate.backfillName;
        if (newV && nameField && this.formModel[nameField]) {
          // 数据回填处理
          this.initData = [{ [this.fieldConfig.key]: this.formModel[nameField], [this.fieldConfig.value]: newV }];
        }
      },
      immediate: true
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
      // 初始化默认的回填数据
      await this.parseInitOptions();
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== "object") {
        // 非对象类型时，中断后续处理
        return false;
      }
      return true;
    },
    handleEvent(event, _id, eventData) {
      if (event === "change" && this.formTemplate.backfillName) {
        this.formModel[this.formTemplate.backfillName] = eventData && eventData[this.fieldConfig.key];
      }
      this.$emit("event", event, _id, eventData);
    },
    async parseInitOptions() {
      const { initOptions } = this.formTemplate;
      if (initOptions) {
        const { conditions, conditionType } = initOptions;
        const isNeed = await this.coreProcessor.parseConditions(conditions, conditionType);
        if (isNeed) {
          const { type = "single" } = initOptions;
          if (type === "single") {
            // 单选场景下，分开解析 label 和 value 的取值，再拼装后丢给组件初始化
            const { labelDataSource, valueDataSource } = initOptions;
            const label = await this.coreProcessor.parseDataSource(labelDataSource);
            const value = await this.coreProcessor.parseDataSource(valueDataSource);
            this.initData = [
              {
                [this.fieldConfig.key || "name"]: label,
                [this.fieldConfig.value || "id"]: value
              }
            ];
          } else if (type === "multiple") {
            // 多选场景下，直接解析默认的 options 数组来源
            const { dataSource } = initOptions;
            let options = await this.coreProcessor.parseDataSource(dataSource);
            options = options || [];
            const { fieldConfig } = dataSource;
            if (fieldConfig) {
              const { key = "name", value = "id" } = fieldConfig;
              options = options.map(v => {
                return {
                  [this.fieldConfig.key || "name"]: v[key],
                  [this.fieldConfig.value || "id"]: v[value]
                };
              });
            }
            this.initData = options;
          }
        }
      }
    },
    async callRemoteMethod(keyword = "", page = 1) {
      if (this.metadata.dataSource) {
        const dataSource = {};
        const params = this.metadata.dataSource.params || [];
        Object.assign(dataSource, this.metadata.dataSource, {
          params: [
            ...params,
            {
              key: "keyword",
              value: keyword.trim()
            },
            {
              key: "page",
              value: page
            }
          ]
        });
        const result = await this.coreProcessor.parseDataSource(dataSource);
        return result || [];
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
