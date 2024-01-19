import CoreProcessor from '../index';
import request from '../request';

export default class FormModelHandler {
  coreProcessor = new CoreProcessor();

  constructor(coreProcessor) {
    this.coreProcessor = coreProcessor;
  }

  /**
   * 解析元数据的初始化表单模型数据的配置信息，根据配置信息，获取初始化数据
   * @returns
   */
  async parseInitData() {
    const metadata = this.coreProcessor.getStore()?.state()?.metadata;
    const initFormMode = metadata.initFormMode;
    if (initFormMode) {
      const { url, method = 'get', params, dataKey = 'data', conditions, conditionType } = initFormMode;
      const isNeed = await this.coreProcessor.parseConditions(conditions, conditionType);
      if (isNeed) {
        const _params = await this.coreProcessor.parseParams(params);
        let res = {};
        try {
          res = await request({
            method,
            url,
            params: _params,
            dataKey
          });
        } catch (error) {
          console.error(error);
        }
        // 加入钩子，支持在拉取到初始化数据后，注入 service 来自己加工处理数据
        const { parseServiceName } = initFormMode;
        if (parseServiceName) {
          const dataService = this.coreProcessor.getDataService();
          res = await dataService.exec(parseServiceName, { $event: res });
        }
        if (res) {
          return res;
        }
      }
    }
    return null;
  }

  /**
   * 从元数据的组件配置列表里提取出 formModel 数据模型
   * 同时会以表单的 _id  属性来作为键值缓存当前组件的字段所挂载的数据模型对象
   * @param {*} components
   * @return {*} 返回数据模型对象
   */
  async parseFormModel(components) {
    const _map = {};
    // 从元数据里，根据每个组件的 name, value 属性，组装成 formModel 模x型
    const _formModel = {};
    let _id = 1;
    const parseComponents = (components, model) => {
      components.forEach(v => {
        if (v._id == null && v.type) {
          // 没有 _id 属性的，自动生成 _id 填充
          v._id = v.type + '_' + _id++;
        }
        if (v._id != null) {
          // 只缓存有 _id 的数据，没有 _id 意味着也没有 type，表示多维数组，无需处理
          _map[v._id] = model;
        }
        // 如果表单组件有配置 name 属性时
        if (v.name) {
          // 当有内嵌组件时，递归处理 { name: {...} }
          if (v.components && v.components.length) {
            const _insideModel = {};
            parseComponents(v.components, _insideModel);
            if (Array.isArray(v.value)) {
              // 如果有设置 value: []，那么内嵌组件需要放入父层的数组里
              model[v.name] = v.value;
              model[v.name].push(_insideModel);
            } else {
              // 默认内嵌对象类型数据
              model[v.name] = _insideModel;
            }
          } else {
            // 其他场景(基础表单组件)直接赋值 { name: value }
            model[v.name] = v.value != null ? v.value : '';
          }
        } else if (v.value && typeof v.value === 'object') {
          // 当没有 name 属性，但有 value 且是对象类型时，解析 value（通常是自定义业务组件时的配置）
          Object.keys(v.value).forEach(key => {
            model[key] = v.value[key];
          });
        } else if (Array.isArray(v)) {
          // 当 components 子项为数组时，需要进一步扁平化处理（通常是多列布局的场景）
          parseComponents(v, model);
        } else if (v.components && v.components.length) {
          // 当没有 name 属性，也没有对象类型的 value 属性，但有 components 时，扁平化递归处理
          parseComponents(v.components, model);
        }
      });
    };
    // 从元数据组装表单数据 formModel
    parseComponents(components, _formModel);
    const formModelMap = this.coreProcessor.getStore()?.state()?.formModelMap;
    // 更新数据仓库里的 formModelMap 数据
    this.coreProcessor.getStore()?.commit('updateFormModelMap', { ...formModelMap, ..._map });
    return _formModel;
  }
}
