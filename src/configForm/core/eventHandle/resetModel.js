import BaseEventHandle from './base';

/**
 * 重置表单模型字段：formModel[formModelKey] = value
 *
 */
export default class ResetModelEvent extends BaseEventHandle {
  async exec() {
    this.log('exec() start, eventHandle =', this.eventHandle, 'eventData =', this.eventData);
    const { formModelKey, value } = this.eventHandle;
    const formModel = this.coreProcessor.getFormModel();
    let obj = formModel;
    const keys = formModelKey.split('.');
    while (keys.length > 1) {
      obj = obj[keys.shift()];
    }
    obj[keys.shift()] = value;
  }
}
