import request, { submit } from './request';
import getCondition from './condition/factory';
import getDataSource from './dataSource/factory';
import getEventHandle from './eventHandle/factory';
import getExpresstion from './expression/factory';
import getInitHandle from './initHandle/factory';
import getParam from './param/factory';
import DataService from './dataService';
import MetadataHandler from './metadataHandler';
import FormModelHandler from './formModelHandler';

const log = (...args) => {
  if (window.__debug_log__) {
    console.log('[core]', ...args);
  }
};

/**
 * 中央处理器，持有配置化页面根组件实例，统筹所有配置化处理器工作
 */
export default class CoreProcessor {
  // 配置化页面根组件实例
  rootInstances;
  keysSavedInWindow;

  constructor(rootInstances) {
    this.rootInstances = rootInstances;
    if (rootInstances) {
      rootInstances.$on('hook:destroyed', () => {
        this.clear();
      });
    }
  }

  /**
   * 从元数据的组件配置列表里提取生成 formModel 对象
   * @param {*} components
   * @returns
   */
  async parseFormModel(components) {
    const formModelHandler = this.getFormModelHandler();
    // 拉取表单初始化数据，如果有设置的话
    const initFormData = await formModelHandler.parseInitData();
    this.getStore()?.commit('updateInitFormData', initFormData);

    // 提取表单数据模型
    const _formModel = await formModelHandler.parseFormModel(components);
    // 根据 initData 对表单数据做初始化
    Object.assign(_formModel, initFormData);
    this.getStore()?.commit('updateFormModel', _formModel);
    return _formModel;
  }

  /**
   * 解析组件的联动关系、事件监听、初始化规则，以及缓存
   * @param {*} components
   */
  async parseComponents(components) {
    return this.getMetadataHandler().parseComponents(components);
  }

  /**
   * 解析元数据的全局配置信息（表单页的底部按钮、全局数据源等）
   * @param {*} metadata
   */
  async parseGlobalConfig(metadata) {
    if (metadata.footerBtns) {
      // 保存表单底部按钮的配置信息
      const metadataMap = this.getStore()?.state()?.metadataMap;
      const initRulesMap = this.getStore()?.state()?.initRulesMap;
      if (metadataMap && initRulesMap) {
        metadata.footerBtns.forEach(v => {
          if (v._id) {
            metadataMap[v._id] = v;
            if (v.initRules) {
              initRulesMap[v._id] = v.initRules;
            }
          }
        });
      }
    }
    if (metadata.dataSource) {
      const saveKeys = [];
      const saveType = [];
      const allP = [];
      let arr = [];
      // 表单根元素上支持配置多个数据源
      if (Array.isArray(metadata.dataSource)) {
        arr = metadata.dataSource;
      } else {
        arr = [metadata.dataSource];
      }
      arr.forEach(v => {
        if (v.saveKey) {
          saveKeys.push(v.saveKey);
          saveType.push(v.saveType || 'window'); // 保存方式，支持 window, store
          allP.push(this.parseDataSource(v));
        }
      });
      const result = await Promise.all(allP);
      saveKeys.forEach((key, i) => {
        if (saveType[i] === 'store') {
          this.getStore()?.commit(`update${key[0].toUpperCase()}${key.substr(1)}`, result[i]);
        } else {
          window[Symbol.for(key)] = result[i];
          this.keysSavedInWindow = this.keysSavedInWindow || [];
          this.keysSavedInWindow.push(key);
        }
      });
    }
  }

  /**
   * 解析单个数据源，并将数据返回
   * @param {*} dataSource
   * @returns
   */
  async parseDataSource(dataSource, extraArgs) {
    const result = await this.getDataSource(dataSource, extraArgs).exec();
    return result;
  }

  /**
   * 解析多个数据源，并将数据挂载到 target 上
   * @param {*} target
   * @param {*} dataSources
   */
  async parseMultipleDataSource(target, dataSources) {
    if (dataSources) {
      const saveKeys = [];
      const allP = [];
      let arr = [];
      if (Array.isArray(dataSources)) {
        arr = dataSources;
      } else {
        arr = [dataSources];
      }
      arr.forEach(v => {
        // 没有设置 saveKey 的过滤掉
        if (v.saveKey) {
          saveKeys.push(v.saveKey);
          allP.push(this.parseDataSource(v));
        }
      });
      const result = await Promise.all(allP);
      // 支持通过 . 连接符来挂载内嵌字段
      saveKeys.forEach((key, i) => {
        const keys = key.split('.');
        let parent = target;
        while (keys.length > 1) {
          const key = keys.shift();
          parent[key] = parent[key] || {};
          parent = parent[key];
        }
        parent[keys.shift()] = result[i];
      });
    }
  }

  /**
   * 解析是否满足指定的条件列表 conditions
   * @param {*} conditions 条件列表
   * @param {*} conditionType every 满足全部条件，some 满足任一条件
   * @param {*} eventData 事件上下文数据
   * @return true 满足条件， false 不满足条件
   */
  async parseConditions(conditions, conditionType = 'every', eventData) {
    if (!conditions || conditions.length === 0) {
      return true;
    }
    const condi = [];
    for (let i = 0; i < conditions.length; i++) {
      condi[i] = this.getCondition(conditions[i], { eventData }).exec();
    }
    for (let i = 0; i < conditions.length; i++) {
      condi[i] = await condi[i];
    }
    if (conditionType === 'some') {
      return condi.some(v => !!v);
    }
    return condi.every(v => !!v);
  }

  /**
   * 解析并执行事件响应行为
   * @param {*} eventHandles
   * @param {*} eventData
   */
  parseEventHandles(eventHandles, eventData) {
    eventHandles.forEach(eventHandle => {
      this.getEventHandle(eventHandle, eventData).exec();
    });
  }

  /**
   * 解析并执行初始化行为
   * @param {*} handles
   * @param {*} _id
   */
  parseInitHandles(handles, _id) {
    handles.forEach(handle => {
      this.getInitHandle(handle, _id).exec();
    });
  }

  /**
   * 解析参数配置，并返回获取到的参数
   * @param {*} params
   * @returns
   */
  async parseParams(params, extraArgs) {
    const res = {};
    if (Array.isArray(params) && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        const p = await this.getParam(params[i], extraArgs).exec();
        Object.assign(res, p);
      }
    }
    return res;
  }

  /**
   * 事件中枢，接收所有事件触发，并派发具体响应行为
   * @param {*} event
   * @param {*} itemId
   * @param {*} eventData
   */
  handleComponentEvent(event, itemId, eventData) {
    log('handleComponentEvent()', { event, itemId, eventData });
    // 根据事件监听处理响应事件
    const eventListenerMap = this.getStore()?.state()?.eventListenerMap || {};
    const eventListener = eventListenerMap[itemId];
    if (eventListener) {
      eventListener.forEach(v => {
        if (v.event === event) {
          const { handles = [], conditions, conditionType } = v;
          this.parseConditions(conditions, conditionType, eventData).then(valid => {
            if (valid) {
              this.parseEventHandles(handles, eventData);
            }
          });
        }
      });
    }
  }

  /**
   * 解析并执行所有组件的初始化行为
   */
  handleInitRules({ _initRulesMap = null, _metadataMap = null } = {}) {
    const metadataMap = _metadataMap || this.getStore()?.state()?.metadataMap || {};
    const initRulesMap = _initRulesMap || this.getStore()?.state()?.initRulesMap || {};
    Object.keys(metadataMap).forEach(id => {
      if (initRulesMap[id]) {
        const rules = initRulesMap[id];
        rules.forEach(rule => {
          const { handles = [], conditions, conditionType } = rule;
          this.parseConditions(conditions, conditionType).then(valid => {
            if (valid) {
              this.parseInitHandles(handles, id);
            }
          });
        });
      }
    });
  }

  /**
   * 批量将所有组件的 disabled 设置为 1
   */
  disableAll(disableAllConfig, _metadataMap) {
    const { conditions, conditionType } = disableAllConfig || {};
    this.parseConditions(conditions, conditionType).then(valid => {
      if (valid) {
        const metadataMap = _metadataMap || this.getStore()?.state()?.metadataMap || {};
        Object.values(metadataMap).forEach(v => {
          v.disabled = 1;
        });
      }
    });
  }

  /**
   * 表单提交
   * @param {*} url
   * @param {*} data
   * @returns
   */
  handleSubmit(url, data) {
    log('handleSubmit()', { url, data });
    return submit(url, data);
  }

  request(options) {
    return request(options);
  }

  clear() {
    if (this.keysSavedInWindow?.length) {
      this.keysSavedInWindow.forEach(key => {
        delete window[Symbol.for(key)];
      });
    }
  }

  /**
   * 获取配置页组件实例
   * @returns
   */
  getPageInstance() {
    const type = this.rootInstances?.type;
    return {
      formPage: this.rootInstances?.$refs?.formPageRef,
      listPage: this.rootInstances?.$refs?.listPageRef
    }[type];
  }

  /**
   * 获取 store
   * @returns 返回 store 的可操作 api 列表
   */
  getStore() {
    return this.rootInstances?.store;
  }

  /**
   * 获取临时数据挂载对象，可用于给 dataService 里挂载数据使用
   */
  getTempData() {
    return this.getStore()?.state().tempData;
  }

  /**
   * 获取表单的数据模型
   * @returns
   */
  getFormModel() {
    return this.getStore()?.state().formModel;
  }

  /**
   * 获取以 _id 为键值缓存的表单数据模型
   * @returns
   */
  getFormModelMap() {
    return this.getStore()?.state().formModelMap;
  }

  /**
   * 获取指定表单组件字段所挂载的 formModel 对象，常用语内嵌组件或数组项组件的场景
   * @param {*} id 组件 id
   * @returns
   */
  getParentFormModelById(id) {
    return this.getFormModelMap()[id];
  }

  /**
   * 解析组件的联动关系、事件监听、初始化规则，以及缓存
   * @param {*} components
   * @returns {} {_initRulesMap,_metadataMap,_eventListenerMap}
   */
  getInfoByParseComponents(components) {
    return this.getMetadataHandler().getInfoByParseMetadata(components);
  }

  /**
   * 获取以 _id 为键值缓存的元数据
   * @returns
   */
  getMetadataMap() {
    return this.getStore()?.state().metadataMap || {};
  }

  /**
   * 获取指定组件的元数据
   * @param {*} id 组件 id
   * @returns
   */
  getMetadataById(id) {
    return this.getMetadataMap()[id];
  }

  /**
   * 初始化数据服务
   * @param {*} services
   * @returns { DataService }
   */
  generateDataService(services) {
    return new DataService(this, services);
  }

  /**
   * 获取数据服务
   */
  getDataService() {
    return this.getStore()?.state()?.dataService;
  }

  /**
   * 获取元数据处理器
   * @returns { MetadataHandler }
   */
  getMetadataHandler() {
    return new MetadataHandler(this);
  }

  /**
   * 拉取元数据
   * @param {*} code 元数据唯一标识 code
   * @param {*} version 元数据版本，不传默认拉取最新
   * @param {*} metadata 本地元数据，当有传入 code 时，优先拉取远程元数据
   * @returns
   */
  getRemoteMetadata(code, version, metadata) {
    return this.getMetadataHandler().getRemoteMetadata(code, version, metadata);
  }

  /**
   * 获取数据模型处理器
   * @returns { FormModelHandler }
   */
  getFormModelHandler() {
    return new FormModelHandler(this);
  }

  /**
   * 根据 condition 配置数据获取条件处理器
   * @param {*} condition 条件的元数据配置
   * @returns
   */
  getCondition(condition, extraArgs) {
    return getCondition(this, condition, extraArgs);
  }

  /**
   * 根据 dataSource 配置数据获取数据源处理器
   * @param {*} dataSource 数据源的元数据配置
   * @returns
   */
  getDataSource(dataSource, extraArgs) {
    return getDataSource(this, dataSource, extraArgs);
  }

  /**
   * 根据 eventHandle 配置数据获取事件处理器
   * @param {*} eventHandle 事件的元数据配置
   * @param {*} eventData 事件发生时传递的参数
   * @returns
   */
  getEventHandle(eventHandle, eventData, extraArgs) {
    return getEventHandle(this, eventHandle, eventData, extraArgs);
  }

  /**
   * 根据 expression 配置数据获取表达式处理器
   * @param {*} expression 表达式的元数据配置
   * @returns
   */
  getExpresstion(expression, extraArgs) {
    return getExpresstion(this, expression, extraArgs);
  }

  /**
   * 根据 handle 配置数据获取初始化处理器
   * @param {*} handle 初始化规则的元数据配置
   * @param {String} _id 组件 _id
   * @returns
   */
  getInitHandle(handle, _id, extraArgs) {
    return getInitHandle(this, handle, _id, extraArgs);
  }

  /**
   * 根据 param 配置数据获取参数处理器
   * @param {*} param 参数的元数据配置
   * @returns
   */
  getParam(param, extraArgs) {
    return getParam(this, param, extraArgs);
  }

  /**
   * 获取灰度开关列表
   * 直接从 $store.state.app.grayPublish 读取
   */
  getGrayPublish() {
    return this.rootInstances?.$store?.state.app.grayPublish || {};
  }

  /**
   * 更新数据仓库里的初始化规则缓存信息 initRulesMap
   * @param {*} data
   */
  updateInitRulesMap(data) {
    log('updateInitRulesMap', data);
    if (data) {
      const initRulesMap = this.getStore()?.state()?.initRulesMap;
      this.getStore()?.commit('updateInitRulesMap', { ...initRulesMap, ...data });
    }
  }

  /**
   * 更新数据仓库里的元数据缓存信息 metadataMap
   * @param {*} data
   */
  updateMetadataMap(data) {
    log('updateMetadataMap', data);
    if (data) {
      const metadataMap = this.getStore()?.state()?.metadataMap;
      this.getStore()?.commit('updateMetadataMap', { ...metadataMap, ...data });
    }
  }

  /**
   * 更新数据仓库里的事件监听缓存信息 eventListenerMap
   * @param {*} data
   */
  updateEventListenerMap(data) {
    log('updateEventListenerMap', data);
    if (data) {
      const eventListenerMap = this.getStore()?.state()?.eventListenerMap;
      this.getStore()?.commit('updateEventListenerMap', { ...eventListenerMap, ...data });
    }
  }

  /**
   * 更新数据仓库里的表单模型缓存信息 formModelMap
   * @param {*} ids
   * @param {*} data
   */
  updateFormModelMap(ids, data) {
    log('updateFormModelMap', data);
    if (ids?.length && data) {
      const map = {};
      ids.forEach(id => {
        map[id] = data;
      });
      const formModelMap = this.getStore()?.state()?.formModelMap;
      this.getStore()?.commit('updateFormModelMap', { ...formModelMap, ...map });
    }
  }
}
