import CoreProcessor from '../index';
import { fetchFormMetadata } from '../request';

export default class MetadataHandler {
  coreProcessor = new CoreProcessor();

  constructor(coreProcessor) {
    this.coreProcessor = coreProcessor;
  }

  /**
   * 拉取元数据
   */
  async getRemoteMetadata(code, version, metadata) {
    if (code) {
      let res = {};
      try {
        res = await fetchFormMetadata({
          code: code,
          version: version
        });
      } catch (error) {
        console.error(error);
      }
      if (res.errcode === 0 && res.data) {
        let { standard, extend } = res.data;
        // 标准功能的元数据
        if (standard) {
          standard = JSON.parse(standard);
        }
        // 租户的个性化功能的元数据
        if (extend) {
          extend = JSON.parse(extend);
          if (+extend.notMergeToStandard) {
            // 如果配置不合并到标准元数据，就直接使用个性化的元数据
            return extend;
          }
          // 合并个性化元数据到标准元数据上
          this.mergeMetadata(standard, extend);
        }
        if (standard) {
          return standard;
        }
      }
    }
    // 本地元数据需要拷贝再使用，防止受到影响
    const _metadata = JSON.parse(JSON.stringify(metadata));
    return _metadata;
  }

  /**
   * 合并元数据
   * 【合并规则】
   * 深度遍历对象，以 key 值来做匹配，如果是数组，则用下标做匹配
   * 将 元数据 source 合并到元数据 target 上
   * 1. 如果 source[key] 是 null 或 undefined，则跳过该字段不做处理
   * 2. 否则如果 source[key] 是对象或数组，且 target[key] 不存在，则执行 target[key] = source[key]
   * 3. 否则如果 source[key] 是对象或数组，深度递归处理步骤 1
   * 4. 否则 执行 target[key] = source[key]
   *
   * 一些特殊规则：
   * 1. 如果数组子项是对象，且需要删除某一数组子项时，可以在子项对象上设置 delete: 1
   */
  mergeMetadata(target, source) {
    const _deepMerge = (target, source) => {
      Object.keys(source).forEach(key => {
        if (source[key] != null) {
          if (typeof source[key] === 'object' && target[key] == null) {
            target[key] = source[key];
          } else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
            _deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
          // 如果当前是数组，则移除数组子项里 delete = 1 的项
          if (Array.isArray(target[key])) {
            target[key] = target[key].filter(v => !+v.delete);
          }
        }
      });
    };
    _deepMerge(target, source);
  }

  /**
   * 解析组件的联动关系、事件监听、初始化规则，以及缓存，并将数据推送到数据仓库
   * @param {*} components
   */
  parseComponents(components) {
    const { _initRulesMap, _metadataMap, _eventListenerMap } = this.getInfoByParseMetadata(components);
    // 更新数据仓库里的数据
    this.coreProcessor.updateInitRulesMap(_initRulesMap);
    this.coreProcessor.updateMetadataMap(_metadataMap);
    this.coreProcessor.updateEventListenerMap(_eventListenerMap);
  }

  /**
   * 解析组件的联动关系、事件监听、初始化规则，以及缓存
   * @param {*} components
   */
  getInfoByParseMetadata(components) {
    const _initRulesMap = {};
    const _metadataMap = {};
    const _eventListenerMap = {};
    // 遍历所有组件
    const stack = [...components];
    while (stack.length > 0) {
      const v = stack.pop();
      if (v._id != null) {
        _metadataMap[v._id] = v;
      }
      if (v.slotName != null) {
        // 自定义的 slot 组件，用 slot 为 key 值缓存元数据，方便传递配置数据
        _metadataMap[v.slotName] = v;
      }
      if (Array.isArray(v)) {
        stack.push(...v);
      } else {
        if (v.eventListener && v.eventListener.length) {
          _eventListenerMap[v._id] = v.eventListener;
        }
        if (v.initRules && v.initRules.length) {
          _initRulesMap[v._id] = v.initRules;
        }
        if (v.components && v.components.length) {
          stack.push(...v.components);
        }
      }
    }
    return {
      _initRulesMap,
      _metadataMap,
      _eventListenerMap
    };
  }
}
