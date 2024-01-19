import BaseInitHandle from './base';

/**
 * 设置表单项的必填
 */
export default class RequiredHandle extends BaseInitHandle {
  async exec() {
    this.log('exec() start, handle =', this.handle);
    // 第一版：value 只支持配置固定值（导致每次都需要配置 value=1,0 的两套条件）
    let { value } = this.handle;
    // 第二版：增加 valueFrom 配置，以便让 value 取值可以支持表达式。注：当有 valueFrom 配置时，value 字段不生效
    const { valueFrom } = this.handle;
    if (valueFrom) {
      if (valueFrom.type === 'condition') {
        value = await super.parseConditions(valueFrom);
      }
    }

    const metadata = this.coreProcessor.getStore()?.state()?.metadataMap[this._id];
    if (metadata) {
      metadata.required = +value;
    }
  }
}
