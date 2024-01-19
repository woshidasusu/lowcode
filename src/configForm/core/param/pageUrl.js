import BaseParam from './base';

/**
 * 从 url 上获取 param 参数
 */
export default class PageUrlParam extends BaseParam {
  async exec() {
    this.log('exec() start, param =', this.param);
    const { key, dataKey = '' } = this.param;
    const result = {
      [key]: this.getQuery(dataKey || key, location.href) || ''
    };
    this.log('exec() return', result);
    return result;
  }
}
