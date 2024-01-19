import BaseDataSource from './base';
/**
 *  从 store 数据仓库上取数
 */
export default class StoreDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { dataKey } = this.dataSource;
    let result = this.coreProcessor.getStore()?.state();
    // dataKey 支持设置 . 来取内嵌字段
    const dataKeys = dataKey?.split('.');
    while (dataKeys?.length > 0) {
      if (result == null) {
        console.error('[StoreDataSource]', dataKey + ' 读取异常，请检查数据结构');
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    this.log('exec() return', result);
    return result;
  }
}
