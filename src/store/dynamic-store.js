/**
 * 按需动态挂载、卸载的 store 维护列表
 * store 属于模块内单例， 注意模块 store 的 state 需用函数返回对象，避免模块间污染
 * （PS：vscode 可配合 vuex-peek 插件使用）
 */

import { generateStoreOperate } from "./helper";
import demo from "./dynamic/demo";
import cfDesignerEdit from "./dynamic/cfDesignerEdit";

// 模块 key 值列表，需确保唯一性
const DEMO = "demo";
const CFDESINGEREDIT = "cfDesignerEdit";

export default {
  // 数据统计模块
  demo: {
    ...generateStoreOperate(DEMO, demo)
  },
  cfDesignerEdit: {
    ...generateStoreOperate(CFDESINGEREDIT, cfDesignerEdit)
  }
};
