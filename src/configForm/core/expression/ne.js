import BaseExpression from './base';

export default class NeExpression extends BaseExpression {
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
    let result = leftOpe !== rightOpe;
    if (this.expression.expression === '!=') {
      result = leftOpe != rightOpe;
    }
    this.log('exec() return', result);
    return result;
  }
}
