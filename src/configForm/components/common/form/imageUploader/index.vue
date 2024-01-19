<template>
  <el-form-item
    :label="formTemplate.label"
    :prop="parentModelName + formTemplate.name"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="[
      ...(formTemplate.validateRules || []),
      { type: 'array', required: !!+formTemplate.required, message: formTemplate.label + '不能为空' }
    ]"
  >
    <image-uploader-can-paste
      v-model="model"
      :business-id="formTemplate.ossFolder || 'configForm'"
      style="width: 100%"
      auto-input-id
      :disabled="!!+formTemplate.disabled"
      :max-num="+formTemplate.maxNum || 5"
      :max-size="+formTemplate.maxSize || 2"
      v-on="onEvents"
    >
    </image-uploader-can-paste>
  </el-form-item>
</template>

<script>
import { ImageUploaderCanPaste } from '@src/components/uploader';
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[imageUploader]：', ...args);
  }
};
export default {
  components: { ImageUploaderCanPaste },
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
      insideModel: []
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    model: {
      get() {
        let data = this.insideModel;
        if (this.formTemplate.name) {
          data = this.formModel[this.formTemplate.name];
        }
        // 字段映射处理
        if (this.formTemplate.fieldConfig) {
          data = data.map(v => {
            return {
              original: v[this.formTemplate.fieldConfig.original || 'original'],
              preview: v[this.formTemplate.fieldConfig.preview || 'preview']
            };
          });
        }
        return data;
      },
      set(value) {
        let data = value;
        // 字段映射处理
        if (this.formTemplate.fieldConfig) {
          data = data.map(v => {
            return {
              [this.formTemplate.fieldConfig.original || 'original']: v.original,
              [this.formTemplate.fieldConfig.preview || 'preview']: v.preview
            };
          });
        }
        if (this.formTemplate.name) {
          this.formModel[this.formTemplate.name] = data;
        }
        this.insideModel = data;
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
</style>
