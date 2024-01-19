/**
 * 全局共享的基本数据
 */

import { generateMutationsByState } from "../helper";

const state = {
  // 应用是否在初始化
  loading: true,
  // 支持动态添加的全局数据
  global: {}
};

const getters = {};

const mutations = {
  ...generateMutationsByState(state)
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
