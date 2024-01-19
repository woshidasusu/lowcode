<template>
  <div v-loading="loading">
    <!-- 表单页面配置化 -->
    <form-page v-if="type === 'formPage'" ref="formPageRef" v-bind="$attrs" v-on="$listeners">
      <template v-for="item in slots" #[item]="data">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </form-page>
    <!-- 列表页面配置化 -->
    <list-page v-else-if="type === 'listPage'" ref="listPageRef" v-bind="$attrs" v-on="$listeners">
      <template v-for="item in slots" #[item]="data">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </list-page>
  </div>
</template>

<script>
import FormPage from './formPage';
import ListPage from './listPage';
import { registerModule } from '@src/store/helper';
import CoreProcessor from './core';
/**
 * 页面配置化
 * 【metadata】：页面的本地元数据，当传了 code 后，会优先使用远程的元数据
 * 【code】：内部会自动获取 code 对应的元数据，获取失败则使用本地元数据
 */
export default {
  components: {
    FormPage,
    ListPage
  },
  provide() {
    return {
      // 数据仓库 store 模块内共享
      getStore: this.getStore
    };
  },
  props: {
    // 本地元数据，需要进行格式校验
    metadata: {
      type: Object,
      require: true
    },
    // 配置化表单 code，用于向后端拉取对应的表单元数据
    code: {
      type: String,
      default: ''
    },
    // 配置化表单 version，用于兼容多版本共存场景，不传则每次都获取最新版的元数据
    version: {
      type: String,
      default: ''
    },
    // 数据服务，即注入的方法列表
    dataServiceData: {
      type: Object,
      default: null
    }
    // 其余没有声明的 props 通过 $attrs 传给具体页面类型的组件
  },
  data() {
    return {
      loading: false,
      type: '',
      // 配置化模块的 store 数据仓库操作 api
      store: {
        state: () => {},
        commit: () => {},
        dispatch: () => {},
        statesToComputed: () => {},
        register: () => {},
        unregister: () => {}
      }
    };
  },
  computed: {
    slots() {
      return Object.keys(this.$scopedSlots);
    }
  },
  watch: {},
  async mounted() {
    this.loading = true;
    // 生成配置化处理器
    const coreProcessor = new CoreProcessor(this);
    // 获取元数据
    let metadata = await coreProcessor.getRemoteMetadata(this.code, this.version, this.metadata);
    if (process.env.NODE_ENV === 'development') {
      metadata = this.metadata;
    }
    const store = metadata?.store;
    // 声明 store 数据仓库
    const state = {
      coreProcessor: null, // 配置化模块的中央处理器
      dataService: null, // 数据服务，即存储自定义的方法列表，用来扩展自定义交互的能力
      metadata: null, // 元数据
      metadataMap: null, // 组件元数据的缓存，以 _id 为键值存取
      formModel: null, // 从元数据解析得到的表单模型
      formModelMap: null, // 组件绑定的 formModel 字段所挂载的对象，以 _id 为键值存取
      initFormData: null, // 表单的初始化数据，用来编辑场景的数据回填处理
      eventListenerMap: null, // 组件的事件监听处理，以 _id 为键值存取
      initRulesMap: null, // 组件的初始化规则，以 _id 为键值存取
      tempData: {}, // 临时数据存放中心，开辟给 dataService 挂载数据使用
      ...store?.state // 自定义
    };
    // 注册 store
    this.store = registerModule(store?.module || 'config_module', state);
    // 将以下数据放入 store 中，方便模块内部直接读取使用
    this.store.commit('updateMetadata', metadata);
    this.store.commit('updateCoreProcessor', coreProcessor);
    this.store.commit('updateDataService', coreProcessor.generateDataService(this.dataServiceData));

    // 渲染页面
    const type = metadata?.type;
    this.type = type || 'formPage';
    this.loading = false;
  },
  destroyed() {
    if (this.store) {
      this.store.unregister();
    }
  },
  methods: {
    getStore() {
      return this.store;
    },
    // 暴露给外部使用的方法
    getFormModel() {
      return this.$refs.formPageRef.formModel;
    },
    // 暴露给外部使用的方法
    async validate(showError) {
      return this.$refs.formPageRef.validate(showError);
    },
    // 暴露给外部使用的方法
    async validateField(props) {
      return this.$refs.formPageRef.validateField(props);
    },
    // 暴露给外部使用的方法
    resetFields() {
      return this.$refs.formPageRef.resetFields();
    },
    // 暴露给外部使用的方法
    clearValidate() {
      return this.$refs.formPageRef.clearValidate();
    },
    // 暴露给外部使用的方法
    refresh(refreshFormModel) {
      return this.$refs.formPageRef.refresh(refreshFormModel);
    },
    // 暴露给外部使用的方法
    submit() {
      return this.$refs.formPageRef.handleSubmit();
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
