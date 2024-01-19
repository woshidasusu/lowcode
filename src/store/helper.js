import store from './index';
import { storeToComputed } from './store-to-computed';
/**
 * 根据 state 对象属性自动生成 mutations 更新属性的方法，如：
 * state: {
 *  projectId: '',
 *  searchParams: {
 *      batchId: ''
 *  }
 * }
 *
 * ===>
 *
 * {
 *  updateProjectId: (state, payload) => { state.projectId = payLoad }
 *  updateSearchParams: (state, payload) => { state.searchParams = {...state.searchParams, ...payload} }
 *  updateBatchId: (state, payload) => { state.searchParams.batchId = payload }
 *  projectId: (state, payload) => { state.projectId = payload }
 *  searchParams: (state, payload) => { state.searchParams = {...state.searchParams, ...payload} }
 * }
 *
 * 非对像类型的属性直接生成赋值操作，对象类型属性会通过扩展运算符重新生成对象
 * 且会递归处理内部对象的属性，扁平化的生成 updateXXX 方法挂载到 mutations 对象上
 *
 * 对于 state 的属性，会生成同名的更新方法，非对象类型直接复制，对象类型会进行 assign 操作再赋值
 *
 * @param {Object} stateTemplate
 */
export function generateMutationsByState(stateTemplate) {
  const handleInnerObjState = (parentKeyPath, innerState, obj) => {
    Object.keys(innerState).forEach(key => {
      const value = innerState[key];
      const updateKey = `update${key[0].toUpperCase()}${key.substr(1)}`;
      if (typeof value === 'object' && value != null && !Array.isArray(value)) {
        obj[updateKey] = (state, payload) => {
          let target = state;
          for (let i = 0; i < parentKeyPath.length; i++) {
            target = target[parentKeyPath[i]];
          }
          target[key] = { ...target[key], ...payload };
        };
        handleInnerObjState([...parentKeyPath, key], value, obj);
      } else {
        obj[updateKey] = (state, payload) => {
          let target = state;
          for (let i = 0; i < parentKeyPath.length; i++) {
            target = target[parentKeyPath[i]];
          }
          target[key] = payload;
        };
      }
    });
  };
  const mutations = {};
  Object.keys(stateTemplate).forEach(key => {
    const obj = {};
    const value = stateTemplate[key];
    const updateKey = `update${key[0].toUpperCase()}${key.substr(1)}`;
    if (typeof value === 'object' && value != null && !Array.isArray(value)) {
      obj[updateKey] = (state, payload) => {
        state[key] = { ...state[key], ...payload };
      };
      handleInnerObjState([key], value, obj);
    } else {
      obj[updateKey] = (state, payload) => {
        state[key] = payload;
      };
    }
    obj[key] = obj[updateKey];
    Object.assign(mutations, obj);
  });
  return mutations;
}

function _register(moduleName, moduleStore) {
  if (store.state[moduleName]) {
    store.unregisterModule(moduleName);
  }
  store.registerModule(moduleName, moduleStore);
}

function _unregister(moduleName) {
  if (store.state[moduleName]) {
    store.unregisterModule(moduleName);
  }
}

/**
 * 封装一些方便动态模块调用的常见方法
 * @param {*} moduleName 模块名
 * @param {*} moduleStore 模块 store 对象
 * @returns 常见操作方法
 */
export function generateStoreOperate(moduleName, moduleStore) {
  return {
    name: moduleName,
    // 返回模块的 state
    state: () => {
      return store.state[moduleName];
    },
    // 调用模块的 commit，自动拼接上模块名，所以 store 里必须声明 namespced: true
    commit: (mutation, payload, options) => {
      if (store.state[moduleName]) {
        store.commit(`${moduleName}/${mutation}`, payload, options);
      }
    },
    // 调用模块的 dispatch，自动拼接上模块名，所以 store 里必须声明 namespced: true
    dispatch: (action, payload, options) => {
      if (store.state[moduleName]) {
        return store.dispatch(`${moduleName}/${action}`, payload, options);
      }
      return Promise.reject(new Error(moduleName + ' store is no exist'));
    },
    // 对 storeToComputed 的调用封装，内部自动拼接上模块名
    statesToComputed: states => {
      return storeToComputed(moduleName, states);
    },
    // 挂载模块
    register: () => {
      _register(moduleName, moduleStore);
    },
    // 卸载模块
    unregister: () => {
      _unregister(moduleName);
    }
  };
}

let uid = 1;

/**
 * 根据传入的 module 模块名和 stateObj 对象，动态生成一个 store 对象并动态挂载到根 store 上
 * 可用于配置化场景
 *
 * @param {*} module 模块名，会自动加上 dy${uid}_ 前缀，避免出现冲突
 * @param {*} stateObj state 的对象
 * @returns {*} 返回注册的该 store 的操作 api 对象
 */
export function registerModule(module = 'module', stateObj) {
  module = `dy${uid++}_` + module;
  const state = JSON.parse(JSON.stringify(stateObj));
  // 根据 state 对象生成的默认 store，内部自动生成 mutations 操作，规则是扁平化处理 state 对象的字段，拼接上 updateXXX
  const store = {
    namespaced: true,
    state: () => {
      return {
        ...state
      };
    },
    mutations: {
      ...generateMutationsByState(state)
    }
  };
  const operates = {
    ...generateStoreOperate(module, store)
  };
  operates.register();
  return operates;
}
