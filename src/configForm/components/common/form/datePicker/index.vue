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
    <el-date-picker
      v-model="model"
      :type="formTemplate.nativeType || 'datetime'"
      :style="{ width: formTemplate.width || '100%', ...formTemplate.style }"
      :value-format="formTemplate.valueFormat || 'yyyy-MM-dd HH:mm'"
      :format="formTemplate.format || 'yyyy-MM-dd HH:mm'"
      :prefix-icon="formTemplate.prefixIcon || 'el-icon-date'"
      :placeholder="formTemplate.placeholder || `请选择${formTemplate.label || ''}`"
      :disabled="!!+formTemplate.disabled"
      v-bind="formTemplate.$props"
      size="medium"
      v-on="onEvents"
    >
    </el-date-picker>
    <span v-if="formTemplate.tip" class="tip-text"> {{ formTemplate.tip }}</span>
  </el-form-item>
</template>

<script>
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[DateTimePicker]：', ...args);
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
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        events.change = this.handleEvent.bind(this, 'change', this.metadata._id);
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    }
  },
  watch: {
    metadata: {
      handler: function(newV) {
        this.parseMetadata();
      },
      immediate: true
    },
    model(newV) {
      if (this.metadata._id) {
        this.handleEvent('dateChange', this.metadata._id, newV);
      }
    }
  },
  methods: {
    async parseMetadata() {
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
    },
    handleEvent(event, _id, eventData) {
      this.$emit('event', event, _id, eventData);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.tip-text {
  font-size: 14px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
</style>
