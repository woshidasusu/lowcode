import BaseExpression from './base';

export default class NotFindInArrayExpression extends BaseExpression {
  eventData;
  constructor(coreProcessor, expression, { eventData }) {
    super(coreProcessor, expression);
    this.eventData = eventData;
  }

  async exec() {
    this.log('exec() start, expression =', this.expression, 'eventData =', this.eventData);
    const { leftOperate, leftDataSource, rightOperate, rightDataSource } = this.expression;
    let leftOpe = leftOperate;
    let rightOpe = rightOperate;
    if (leftDataSource) {
      leftOpe = await this.coreProcessor.getDataSource(leftDataSource, { eventData: this.eventData }).exec();
    }
    if (rightDataSource) {
      rightOpe = await this.coreProcessor.getDataSource(rightDataSource, { eventData: this.eventData }).exec();
    }
    const result = Array.isArray(leftOpe) ? leftOpe.find(v => v === rightOpe) != null : false;
    this.log('exec() return', result);
    return !result;
  }
}
