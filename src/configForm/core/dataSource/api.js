import BaseDataSource from './base';
import request from '../request';

/**
 * 从接口获取数据源
 */
export default class ApiDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { params } = this.dataSource;
    let _params = {};
    if (params) {
      _params = await this.coreProcessor.parseParams(params, { eventData: this.eventData });
    }
    let result = await request({ ...this.dataSource, params: _params });
    result = await this.parseDataAfterFetched(result);
    this.log('exec() return', result);
    return result;
  }
}
