import CoreProcessor from '../index';
export default class BaseInitHandle {
  coreProcessor = new CoreProcessor();
  handle;
  _id;

  constructor(coreProcessor, handle, _id) {
    this.coreProcessor = coreProcessor;
    this.handle = handle;
    this._id = _id;
  }

  async exec() {}

  log(...args) {
    if (window.__debug_log__) {
      console.log(`[initHandle/${this.handle.type}]`, ...args);
    }
  }

  async parseConditions(config) {
    let result = true;
    const { conditions, conditionType = 'every' } = config || {};
    if (conditions) {
      result = await this.coreProcessor.parseConditions(conditions, conditionType);
    }
    return result;
  }
}
