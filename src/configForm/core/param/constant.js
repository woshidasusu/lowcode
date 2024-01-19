import BaseParam from './base';

/**
 * 常量类型参数
 */
export default class ConstantParam extends BaseParam {
  async exec() {
    this.log('exec() start, param =', this.param);
    const { key, value } = this.param;
    const result = {
      [key]: value
    };
    this.log('exec() return', result);
    return result;
  }
}
