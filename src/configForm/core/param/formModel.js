import BaseParam from './base';
/**
 *  从 formModel 表单数据模型上取数
 */
export default class FormModelParam extends BaseParam {
  async exec() {
    this.log('exec() start, param =', this.param);
    let { key, dataKey } = this.param;
    dataKey = dataKey || key;
    let result = this.coreProcessor.getFormModel();
    // dataKey 支持设置 . 来取内嵌字段
    let res = {};
    if (dataKey) {
      const dataKeys = dataKey.split('.');
      while (dataKeys.length > 0) {
        if (result == null) {
          console.error('[FormModelParam]', dataKey + ' 读取异常，请检查数据结构');
          break;
        }
        const key = dataKeys.shift();
        result = result[key];
      }
      res = {
        [key]: result
      };
    } else {
      res = {
        ...result
      };
    }
    this.log('exec() return', res);
    return res;
  }
}
