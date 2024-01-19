import CoreProcessor from '../index';
export default class BaseCondition {
  coreProcessor = new CoreProcessor();
  condition;

  constructor(coreProcessor, condition) {
    this.coreProcessor = coreProcessor;
    this.condition = condition;
  }

  async exec() {
    return false;
  }

  log(...args) {
    if (window.__debug_log__) {
      console.log(`[condition/${this.condition.type}]`, ...args);
    }
  }
}
