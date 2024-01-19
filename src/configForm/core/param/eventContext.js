import BaseParam from './base';
/**
 *  从事件上下文数据 $event 里取数
 */
export default class EventContextParam extends BaseParam {
  eventData;
  constructor(coreProcessor, param, { eventData }) {
    super(coreProcessor, param);
    this.eventData = eventData;
  }

  async exec() {
    this.log('exec() start, param =', this.param, 'eventData', this.eventData);
    if (this.eventData === undefined) {
      console.warn('[EventContextParam]', 'eventData is undefined');
      return this.eventData;
    }
    const { key, dataKey } = this.param;
    let result = this.eventData;
    if (dataKey === '' || dataKey == null) {
      // 没有设置时，直接返回整个上下文数据
      this.log('exec() return', result);
      return result;
    }
    // dataKey 支持设置 . 来取内嵌字段
    const dataKeys = dataKey.split('.');
    while (dataKeys.length > 0) {
      if (result == null) {
        console.error('[EventContextParam]', dataKey + ' 读取异常，请检查数据结构');
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    const res = {
      [key]: result
    };
    this.log('exec() return', res);
    return res;
  }
}
