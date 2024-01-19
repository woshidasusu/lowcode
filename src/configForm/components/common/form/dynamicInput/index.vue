<template>
  <el-form-item
    :label="formTemplate.label"
    :prop="parentModelName + formTemplate.name"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="formTemplate.validateRules"
  >
    <div v-for="(item, i) in items" :key="'i' + i" class="item">
      <el-input
        v-model="items[i]"
        :type="formTemplate.nativeType"
        :maxlength="formTemplate.maxlength"
        :show-word-limit="!!+formTemplate.showWordLimit"
        :style="{ width: formTemplate.width || '100%' }"
        :placeholder="formTemplate.placeholder || `请输入${formTemplate.label || ''}`"
        :disabled="!!+formTemplate.disabled"
        size="medium"
      ></el-input>
      <el-button class="del-btn" type="text" @click="onItemRemove(i)">
        {{ formTemplate.deleteText || "删除" }}
      </el-button>
    </div>
    <div>
      <i class="icon el-icon-circle-plus-outline" @click="addItem"></i>
      <a class="add-btn" @click="addItem">{{ formTemplate.addText || `添加${formTemplate.label}` }}</a>
      <span v-if="formTemplate.addTip" class="tips">{{ formTemplate.addTip }}</span>
    </div>
  </el-form-item>
</template>

<script>
/**
 * 动态输入框组件
 */
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log("[dynamicInput]：", ...args);
  }
};
export default {
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
      items: []
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
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
      if (this.formTemplate.name) {
        this.formModel[this.formTemplate.name] = this.formModel[this.formTemplate.name] || [];
        if (!Array.isArray(this.formModel[this.formTemplate.name])) {
          this.formModel[this.formTemplate.name] = [this.formModel[this.formTemplate.name]];
        }
        this.items = this.formModel[this.formTemplate.name] || [];
      }
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== "object") {
        // 非对象类型时，中断后续处理
        return false;
      }
      return true;
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit("event", ...args);
    },
    onItemRemove(index) {
      this.items.splice(index, 1);
    },
    addItem() {
      this.items.push("");
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.icon {
  color: #1f93ff;
  font-size: 22px;
  cursor: pointer;
  position: relative;
  top: 3px;
}
.add-btn {
  color: #1f93ff;
  margin-left: 8px;
  cursor: pointer;
}
.del-btn {
  margin-left: 8px;
}
.item {
  &:not(:first-child) {
    margin-top: 16px;
  }
}
.tips {
  color: #999999;
}
</style>
