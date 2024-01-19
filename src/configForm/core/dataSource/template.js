import BaseDataSource from './base';
/**
 *  从模板字段中读取数据源
 */
export default class WindowDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { dataKey } = this.dataSource;
    const key = dataKey || 'options';
    const result = this.dataSource[key];
    this.log('exec() return', result);
    return result;
  }
}
