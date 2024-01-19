/**
 * 动态注册，动态销毁，store 属于模块内单例
 */

import { generateMutationsByState } from "../../helper";

// 通过函数确保模块间相互独立
const state = () => {
  return {
    edit: {
      uid: "",
      pageType: "",
      code: "",
      name: "",
      metadata: "",
      curDragComponent: "",
      curEditComponent: "",
      metadata: ""
    }
  };
};

const getters = {};

const mutations = {
  ...generateMutationsByState(state())
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
