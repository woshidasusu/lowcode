/* eslint-disable*/
// 由于内部有用到 new Function，该文件放开检测
import BaseCondition from './base';

export default class ExecFunctionCondition extends BaseCondition {
  args;

  constructor(coreProcessor, condition, { eventData }) {
    super(coreProcessor, condition);
    this.args = { $event: eventData };
  }

  exec() {
    this.log('exec() start, condition =', this.condition, 'eventData =', this.eventData);
    const { functionBody } = this.condition;
    // 参数只接收对象类型，用的时候统一从 args 里取
    // 注意，因为这种形式执行的函数是运行期动态创建，为了兼容 IE，配置文件编写扩展函数时，不要使用 ES6 语法
    if (this.args && typeof this.args !== 'object') {
      throw new TypeError('args is not a object');
    }
    let fn = new Function('args', functionBody);
    return fn(this.args);
  }
}
