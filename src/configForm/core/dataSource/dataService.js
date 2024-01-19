import BaseDataSource from './base';

/**
 * 调用数据服务
 */
export default class DataServiceDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    // serviceName：函数名，args：参数对象（固定值类型），params：参数解析器解析参数
    const { serviceName, args, params } = this.dataSource;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        let _params = {};
        if (params) {
          _params = await this.coreProcessor.parseParams(params);
        }
        const result = await dataService.exec(serviceName, { ...args, ..._params, $event: this.eventData });
        this.log('exec() return', result);
        return result;
      } catch (error) {
        console.error('[DataServiceDataSource]', error);
      }
    } else {
      console.error('[DataServiceDataSource] - exec() error, cause dataService is null');
    }
  }
}
