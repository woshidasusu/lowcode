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
    <oss-upload
      v-model="model"
      :business-id="formTemplate.ossFolder || 'configForm'"
      style="width: 100%"
      auto-input-id
      :disabled="!!+formTemplate.disabled"
      :max-num="+formTemplate.maxNum || 5"
      :max-size="+formTemplate.maxSize || 10"
      :show-image="+formTemplate.showImage || false"
      :filters="formTemplate.filters"
      :default-field-config="formTemplate.defaultFieldConfig"
      :custom-tips="customTips"
      :can-edit-file-name="+formTemplate.canEditFileName || false"
      v-on="onEvents"
    >
    </oss-upload>
  </el-form-item>
</template>

<script>
import OssUpload from '@src/components/OSSUpload';
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[OSSUpload]：', ...args);
  }
};
export default {
  components: { OssUpload },
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
        return data;
      },
      set(value) {
        const data = value;
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
    },
    customTips() {
      const { maxNum, maxSize, tips } = this.formTemplate;
      return `已上传（${this.model?.length || 0}/${maxNum || 5}）个文件，最大支持${maxSize || 10}MB，${tips ||
        '支持音视频(mp3 / m4a / amr / mp4 / mov)、图片(jpg / jpeg / gif / png)，文件(txt / doc / docx / xls / xlsx / pdf / rar)'}`;
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
