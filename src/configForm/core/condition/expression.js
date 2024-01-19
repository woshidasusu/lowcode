import BaseCondition from './base';

export default class ExpressionCondition extends BaseCondition {
  eventData;
  constructor(coreProcessor, condition, { eventData }) {
    super(coreProcessor, condition);
    this.eventData = eventData;
  }

  async exec() {
    this.log('exec() start, condition =', this.condition, 'eventData =', this.eventData);
    const expr = this.coreProcessor.getExpresstion(this.condition, { eventData: this.eventData });
    const result = await expr.exec();
    this.log('exec() return', result);
    return result;
  }
}
