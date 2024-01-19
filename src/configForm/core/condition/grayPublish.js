import BaseCondition from './base';

/**
 * 根据灰度开关
 */
export default class GrayPublishCondition extends BaseCondition {
  async exec() {
    this.log('exec() start, condition =', this.condition);
    const { code, value } = this.condition;
    const grayPublish = this.coreProcessor.getGrayPublish();
    const result = grayPublish[code] === value;
    this.log('exec() return', result);
    return result;
  }
}
