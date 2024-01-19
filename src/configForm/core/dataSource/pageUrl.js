import BaseDataSource from './base';
/**
 *  从 url 上获取数据
 */
export default class PageUrlDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { dataKey } = this.dataSource;
    const result = this.getQuery(dataKey, location.href) || '';
    this.log('exec() return', result);
    return result;
  }
}
