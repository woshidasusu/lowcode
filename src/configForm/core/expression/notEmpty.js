import BaseExpression from './base';

export default class NotEmptyExpression extends BaseExpression {
  eventData;
  constructor(coreProcessor, expression, { eventData }) {
    super(coreProcessor, expression);
    this.eventData = eventData;
  }

  async exec() {
    this.log('exec() start, expression =', this.expression, 'eventData =', this.eventData);
    const { leftOperate, leftDataSource } = this.expression;
    let leftOpe = leftOperate;
    if (leftDataSource) {
      leftOpe = await this.coreProcessor.getDataSource(leftDataSource, { eventData: this.eventData }).exec();
    }

    const result = Array.isArray(leftOpe) ? leftOpe?.length : leftOpe;
    this.log('exec() return', result);
    return result;
  }
}
