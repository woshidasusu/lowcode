<template>
  <!-- 文本框的必填校验默认不显示错误信息 -->
  <el-form-item
    :label="formTemplate.label"
    :prop="parentModelName + formTemplate.name"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="[...(formTemplate.validateRules || []), { required: !!+formTemplate.required, message: ' ' }]"
  >
    <template v-if="formTemplate.labelSlot" slot="label">
      <slot v-bind="formTemplate" :form-model="formModel" :name="formTemplate.labelSlot.slotName"></slot>
    </template>
    <span>{{ formatShow }}</span>
  </el-form-item>
</template>

<script>
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[text]：', ...args);
  }
};
export default {
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
      default: ''
    }
  },
  data() {
    return {
      insideModel: ''
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
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
    formatShow() {
      const format = this.formTemplate.format;
      if (format?.type === 'array' && Array.isArray(this.model)) {
        return this.model.map(v => v[format?.fieldConfig?.label || 'name']).join(format?.split || '，');
      } else if (format?.type === 'map') {
        return format?.map[this.model];
      }
      return this.formTemplate.showValue || this.model;
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
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
