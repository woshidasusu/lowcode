<template>
  <el-form-item
    :label="formTemplate.label"
    :prop="parentModelName + fieldConfig.start_time"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="[
      ...(formTemplate.validateRules || []),
      { required: !!+formTemplate.required, message: formTemplate.label + '不能为空' }
    ]"
  >
    <div class="date-range-container" :style="{ width: formTemplate.width || '100%', ...formTemplate.style }">
      <el-date-picker
        v-model="startTime"
        :type="formTemplate.nativeType || 'datetime'"
        :value-format="formTemplate.valueFormat || 'yyyy-MM-dd HH:mm'"
        :format="formTemplate.format || 'yyyy-MM-dd HH:mm'"
        :prefix-icon="formTemplate.prefixIcon || 'el-icon-date'"
        :placeholder="startPlaceholder || formTemplate.placeholder || `请选择${formTemplate.label || ''}开始日期`"
        :disabled="!!+formTemplate.disabled"
        v-bind="formTemplate.$props"
        size="medium"
        v-on="onEvents"
      >
      </el-date-picker>
      <span style="margin: 0 8px">~</span>
      <el-date-picker
        v-model="endTime"
        :type="formTemplate.nativeType || 'datetime'"
        :value-format="formTemplate.valueFormat || 'yyyy-MM-dd HH:mm'"
        :format="formTemplate.format || 'yyyy-MM-dd HH:mm'"
        :prefix-icon="formTemplate.prefixIcon || 'el-icon-date'"
        :placeholder="endPlaceholder || formTemplate.placeholder || `请选择${formTemplate.label || ''}结束日期`"
        :disabled="!!+formTemplate.disabled"
        v-bind="formTemplate.$props"
        size="medium"
        v-on="onEvents"
      >
      </el-date-picker>
    </div>

    <span v-if="formTemplate.tip" class="tip-text"> {{ formTemplate.tip }}</span>
  </el-form-item>
</template>

<script>
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[DateRange]：', ...args);
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
        return {
          start_time: '',
          end_time: ''
        };
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
      insideModel: {
        start_time: '',
        end_time: ''
      }
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    fieldConfig() {
      return {
        start_time: 'start_time',
        end_time: 'end_time',
        ...this.formTemplate.fieldConfig
      };
    },
    startTime: {
      get() {
        if (this.formTemplate.value) {
          return this.formModel[this.fieldConfig.start_time];
        }
        return this.insideModel.start_time;
      },
      set(value) {
        if (this.formTemplate.value) {
          this.formModel[this.fieldConfig.start_time] = value;
        }
        this.insideModel.start_time = value;
      }
    },
    endTime: {
      get() {
        if (this.formTemplate.value) {
          return this.formModel[this.fieldConfig.end_time];
        }
        return this.insideModel.end_time;
      },
      set(value) {
        if (this.formTemplate.value) {
          this.formModel[this.fieldConfig.end_time] = value;
        }
        this.insideModel.end_time = value;
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
    },
    startPlaceholder() {
      return this.formTemplate?.$props?.startPlaceholder;
    },
    endPlaceholder() {
      return this.formTemplate?.$props?.endPlaceholder;
    }
  },
  watch: {
    metadata: {
      handler: function(newV) {
        this.parseMetadata();
      },
      immediate: true
    },
    startTime(newV) {
      if (this.metadata._id) {
        this.handleEvent('dateChange', this.metadata._id, {
          [this.fieldConfig.start_time]: newV,
          [this.fieldConfig.end_time]: this.endTime
        });
      }
    },
    endTime(newV) {
      if (this.metadata._id) {
        this.handleEvent('dateChange', this.metadata._id, {
          [this.fieldConfig.start_time]: this.startTime,
          [this.fieldConfig.end_time]: newV
        });
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
.date-range-container {
  display: flex;
  align-items: center;
}
.tip-text {
  font-size: 14px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
</style>
