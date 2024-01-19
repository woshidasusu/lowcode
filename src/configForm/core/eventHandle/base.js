import CoreProcessor from '../index';
export default class BaseEventHandle {
  coreProcessor = new CoreProcessor();
  eventHandle;
  eventData;

  constructor(coreProcessor, eventHandle, eventData) {
    this.coreProcessor = coreProcessor;
    this.eventHandle = eventHandle;
    this.eventData = eventData;
  }

  async exec() {}

  log(...args) {
    if (window.__debug_log__) {
      console.log(`[eventHandle/${this.eventHandle.type}]`, ...args);
    }
  }

  async parseConditions(config) {
    let result = true;
    const { conditions, conditionType = 'every' } = config || {};
    if (conditions) {
      result = await this.coreProcessor.parseConditions(conditions, conditionType, this.eventData);
    }
    return result;
  }
}
