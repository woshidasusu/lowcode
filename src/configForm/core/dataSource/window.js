import BaseDataSource from './base';
/**
 * 从 window 上读取
 */
export default class WindowDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { symbol, dataKey } = this.dataSource;
    let result = window;
    if (symbol) {
      result = window[Symbol.for(symbol)];
    }
    if (dataKey) {
      const dataKeys = dataKey.split('.');
      while (dataKeys.length > 0) {
        if (result == null) {
          console.error('[WindowDataSource]', dataKey + ' 读取异常，请检查数据结构');
          break;
        }
        const key = dataKeys.shift();
        result = result[key];
      }
    }
    this.log('exec() return', result);
    return result;
  }
}
