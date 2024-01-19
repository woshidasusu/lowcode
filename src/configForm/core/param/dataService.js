import BaseParam from './base';

/**
 * 调用数据服务
 */
export default class DataServiceParam extends BaseParam {
  eventData;
  constructor(coreProcessor, param, { eventData }) {
    super(coreProcessor, param);
    this.eventData = eventData;
  }

  async exec() {
    this.log('exec() start, param =', this.param, 'eventData', this.eventData);
    const { serviceName, args } = this.param;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        const result = await dataService.exec(serviceName, args);
        this.log('exec() return', result);
        return result;
      } catch (error) {
        console.error('[DataServiceParam]', error);
      }
    } else {
      console.error('[DataServiceParam] - exec() error, cause dataService is null');
    }
    return {};
  }
}
