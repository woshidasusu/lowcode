import BaseDataSource from './base';

/**
 * 常量类型
 */
export default class ConstantDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { value } = this.dataSource;
    this.log('exec() return', value);
    return value;
  }
}
