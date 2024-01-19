<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    class="form-container"
    :label-width="formTemplate.labelWidth"
    :model="formModel"
    :rules="formTemplate.validateRules"
  >
    <template v-for="(item, i) in components">
      <!-- 第一版 slot 设计感觉不好用 -->
      <slot
        v-if="item._id && !+item.hidden"
        :name="'before' + item._id"
        v-bind="metadataMap['before' + item._id]"
        :form-model="formModel"
      ></slot>
      <!-- 第二版 slot 排版位置直接根据元数据配置的位置即可 -->
      <template v-if="item.type === 'slot2'">
        <slot v-if="!+item.hidden" :name="item.slotName" v-bind="item" :form-model="formModel"></slot>
      </template>
      <component
        :is="ALL_COMPONENTS[item.type] || ALL_COMPONENTS['element']"
        v-else-if="!+item.hidden"
        :ref="item._id"
        :key="i"
        :style="item.style"
        :metadata="item"
        :form-model="formModel"
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
        :form-model="formModel"
      ></slot>
    </template>

    <slot name="footer-btns">
      <div class="footer-btns" :style="{ 'margin-left': formTemplate.labelWidth, 'margin-bottom': '40px' }">
        <template v-for="(item, i) in formTemplate.footerBtns">
          <el-button
            v-if="!+item.hidden"
            :key="i"
            :disabled="!!+item.disabled"
            style="min-width: 88px"
            size="medium"
            :type="item.nativeType"
            :plain="!!+formTemplate.plain"
            @click="onFooterBtnClick(item.type)"
            >{{ item.text }}</el-button
          >
        </template>
      </div>
    </slot>
  </el-form>
</template>

<script>
import ALL_COMPONENTS from './components';
import CoreProcessor from './core';
/**
 * 配置化表单
 *
 */
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[form]：', ...args);
  }
};
export default {
  inject: ['getStore'],
  props: {
    // 如果使用了内置的取消按钮和行为，那在取消前有钩子可以使用，return false 会中断后续内置的取消行为
    beforeCancel: {
      type: Function,
      default: () => true
    },
    // 如果使用了内置的提交按钮和行为，那在提交前有钩子可以使用，return false 会中断后续内置的取消行为
    beforeSubmit: {
      type: Function,
      default: () => true
    },
    // 如果使用了内置的提交按钮和行为，那在提交后接收到请求响应数据时，有钩子可以使用，return false 会中断后续内置的行为，比如自动关闭页面等
    afterSubmit: {
      type: Function,
      default: () => true
    },
    // 解析完 formModel 数据模型后触发，参数会传入 formModel 对象，可以对数据模型操作，来处理一些初始化工作
    afterParseFormModel: {
      type: Function,
      default: () => undefined
    },
    beforeRender: {
      // 渲染组件前的操作,这时候已经处理好所有初始化数据,目前抛出了formModel和metaData
      type: Function,
      default: () => undefined
    }
  },
  data() {
    return {
      metadata: null,
      loading: false,
      ALL_COMPONENTS: ALL_COMPONENTS, // 所有支持的表单项列表
      components: [], // 待渲染的组件列表
      formModel: {}, // 从元数据解析的默认表单模型
      formModelBackUp: {} // 将初始表单模型进行备份，以便需要重置表单状态时使用
    };
  },
  computed: {
    // 表单的元数据
    formTemplate() {
      return this.metadata || {};
    },
    slots() {
      return Object.keys(this.$scopedSlots);
    },
    metadataMap() {
      return this.getStore()?.state()?.metadataMap || {};
    }
  },
  watch: {},
  async mounted() {
    this.metadata = this.getStore()?.state()?.metadata;
    await this.parseMetadata();
  },
  methods: {
    // 解析元数据
    async parseMetadata() {
      if (!this.metadata) {
        return;
      }
      this.loading = true;
      log('parseMetadata()', this.metadata);
      // 先校验元数据格式的合法性
      if (!this.validateMetadata()) {
        this.loading = false;
        return;
      }
      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      // 解析获取数据模型
      this.formModel = await coreProcessor.parseFormModel(this.metadata.components);
      if (this.afterParseFormModel) {
        await this.afterParseFormModel(this.formModel);
      }
      await coreProcessor.parseComponents(this.metadata.components);
      await coreProcessor.parseGlobalConfig(this.metadata);
      if (this.metadata.disableAll) {
        // 一次性把所有组件的 disaled 置为 1，可用于编辑页批量禁止编辑的场景，个别组件可通过 initRules 再去更新 disabled
        await coreProcessor.disableAll(this.metadata.disableAll);
      }

      // 处理表单组件的初始化规则
      coreProcessor.handleInitRules();
      // 渲染表单前，先备份一份初始干净的表单模型
      this.formModelBackUp = JSON.parse(JSON.stringify(this.formModel));
      log('parseFormModel()', this.formModel);

      if (this.beforeRender) {
        await this.beforeRender(this.formModel, this.metadata);
      }

      // 渲染表单组件
      this.components = this.metadata.components;
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    // 这里就只校验表单基础信息字段格式，具体的表单项的数据格式校验，交由各自表单组件内部去校验
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      if (!this.metadata.components || !this.metadata.components.length) {
        // components 数组为空时，中断后续处理
        return false;
      }
      // 校验是否有支持的 type 表单组件
      const findUndefined = this.metadata.components.find(v => {
        return !this.ALL_COMPONENTS[v.type] && !v.type.startsWith('el-') && !['slot2'].includes(v.type);
      });
      if (findUndefined) {
        console.error(`不支持 ${findUndefined.type} 表单组件`);
        return false;
      }
      log('validateMetadata() - return true');
      return true;
    },

    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(event, formItemId, eventData) {
      log('handleComponentEvent()', { event, formItemId, eventData });
      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      coreProcessor.handleComponentEvent(event, formItemId, eventData);
      this.$emit('event', event, formItemId, eventData);
    },
    // 底部按钮被点击
    onFooterBtnClick(type) {
      if (type === 'cancel') {
        this.goBack();
      } else if (type === 'submit') {
        this.handleSubmit();
      }
    },
    goBack() {
      const result = this.beforeCancel(this.formModel);
      if (result === false) {
        // 钩子明确返回 false 时，中断后续行为
        console.info('stop cancel, cause beforeCancel return false');
        return;
      }
      this.$router.back();
    },
    async handleSubmit(isContinue) {
      const submitConfig = this.formTemplate.submitConfig || {};
      const { url, showError = 1, autoBack = 1 } = submitConfig;
      if (!url) {
        // 没有配置 submitConfig 时，中断提交
        console.error('stop submit, cause submitConfig is invalid');
        return;
      }
      const result = this.beforeSubmit(this.formModel);
      if (result === false) {
        // 钩子明确返回 false 时，中断提交
        console.info('stop submit, cause beforeSubmit return false');
        return;
      }
      const valid = await this.validate(showError);
      if (!valid) {
        // 校验不通过，中断提交
        return;
      }
      if (isContinue == null) {
        isContinue = !autoBack;
      }
      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      const formModel = this.formModel;
      this.loading = true;
      let res = {};
      try {
        res = await coreProcessor.handleSubmit(url, {
          ...formModel
        });
      } catch (error) {
        console.error(error);
        res = error;
      } finally {
        this.loading = false;
      }
      if (this.afterSubmit(res) === false) {
        // 钩子明确返回 false 时，中断后续行为
        console.info('stop exec, cause afterSubmit return false');
        return;
      }
      if (res.errcode === 0) {
        this.$message.success('提交成功');
        if (!isContinue) {
          this.goBack();
        }
      } else {
        this.$message.error(res.errmsg || '提交失败');
      }
    },
    // 暴露给外部使用的方法
    async validate(showError) {
      return new Promise(resolve => {
        this.$refs.formRef.validate((valid, errors) => {
          log('validate() - result =', valid, errors);
          if (!valid && showError) {
            const msg = Object.values(errors)[0][0].message;
            msg && this.$message.error(msg);
          }
          resolve(valid);
        });
      });
    },
    // 暴露给外部使用的方法
    async validateField(props) {
      return new Promise(resolve => {
        this.$refs.formRef.validateField(props, errors => {
          log('validate() - result =', errors);
          resolve(!errors);
        });
      });
    },
    // 暴露给外部使用的方法
    resetFields() {
      this.$refs.formRef.resetFields();
    },
    // 暴露给外部使用的方法
    clearValidate() {
      this.$refs.formRef.clearValidate();
    },
    // 暴露给外部使用的方法
    refresh(refreshFormModel) {
      this.loading = true;
      this.components = [];
      if (refreshFormModel) {
        // 重新从头开始解析元数据；常用于表单的编辑、详情场景的页面刷新，因为此时需要重新拉取表单详情数据更新页面
        setTimeout(() => {
          this.parseMetadata();
        }, 0);
      } else {
        // 仅重新渲染组件，并延用初始状态的 formModel；常用于表单登记场景的页面刷新，因为此时只需要达到恢复初始状态的表单刷新效果即可
        this.formModel = JSON.parse(JSON.stringify(this.formModelBackUp));
        this.getStore()?.commit('updateFormModel', this.formModel);
        setTimeout(() => {
          this.components = [...this.metadata.components];
          this.loading = false;
        }, 0);
      }
    },
    // 暴露给外部使用的方法
    getFormModel() {
      return this.formModel;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.form-container {
  color: #333333;
}
.footer-btns {
  &:empty {
    display: none;
  }
}
</style>
