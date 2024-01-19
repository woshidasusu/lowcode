import BaseCondition from './base';

/**
 * 调用数据服务
 */
export default class DataServiceCondition extends BaseCondition {
  eventData;
  constructor(coreProcessor, condition, { eventData }) {
    super(coreProcessor, condition);
    this.eventData = eventData;
  }

  async exec() {
    this.log('exec() start, condition =', this.condition, 'eventData =', this.eventData);
    const { serviceName, args } = this.condition;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        const result = await dataService.exec(serviceName, { ...args, $event: this.eventData });
        this.log('exec() return', result);
        return result;
      } catch (error) {
        console.error('[DataServiceCondition]', error);
      }
    } else {
      console.error('[DataServiceCondition] - exec() error, cause dataService is null');
    }
  }
}
