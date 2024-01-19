/* eslint-disable*/
// 由于内部有用到 new Function，该文件放开检测
import BaseEventHandle from './base';

/**
 * 通过 new Function 执行函数
 *
 */
export default class ExecFunctionEvent extends BaseEventHandle {
  async exec() {
    this.log('exec() start, eventHandle =', this.eventHandle, 'eventData =', this.eventData);
    const { functionBody } = this.eventHandle;
    const args = { context: this.coreProcessor, $event: this.eventData };
    // 参数只接收对象类型，用的时候统一从 args 里取
    // 注意，因为这种形式执行的函数是运行期动态创建，为了兼容 IE，配置文件编写扩展函数时，不要使用 ES6 语法
    if (args && typeof args !== 'object') {
      throw new TypeError('args is not a object');
    }
    let fn = new Function('args', functionBody);
    return fn(args);
  }
}
