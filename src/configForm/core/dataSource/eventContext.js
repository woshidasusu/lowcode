import BaseDataSource from './base';
/**
 *  从事件上下文数据 $event 里取数
 */
export default class EventContextDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    if (this.eventData === undefined) {
      console.warn('[EventContextDataSource]', 'eventData is undefined');
      return this.eventData;
    }
    const { dataKey } = this.dataSource;
    let result = this.eventData;
    if (dataKey === '' || dataKey == null) {
      // 没有设置时，直接返回整个上下文数据
      this.log('exec() return', result);
      return result;
    }
    // dataKey 支持设置 . 来取内嵌字段
    const dataKeys = dataKey?.split('.');
    while (dataKeys?.length > 0) {
      if (result == null) {
        console.error('[EventContextDataSource]', dataKey + ' 读取异常，请检查数据结构');
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    this.log('exec() return', result);
    return result;
  }
}
