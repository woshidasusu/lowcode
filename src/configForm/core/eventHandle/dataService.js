import BaseEventHandle from './base';

/**
 * 调用数据服务
 */
export default class DataServiceEvent extends BaseEventHandle {
  async exec() {
    this.log('exec() start, eventHandle =', this.eventHandle, 'eventData =', this.eventData);
    // serviceName：函数名，args：参数对象（固定值类型），params：参数解析器解析参数
    const { serviceName, args, params } = this.eventHandle;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        let _params = {};
        if (params) {
          _params = await this.coreProcessor.parseParams(params);
        }
        return await dataService.exec(serviceName, { $event: this.eventData, ...args, ..._params });
      } catch (error) {
        console.error('[DataServiceEvent]', error);
      }
    } else {
      console.error('[DataServiceEvent] - exec() error, cause dataService is null');
    }
  }
}
