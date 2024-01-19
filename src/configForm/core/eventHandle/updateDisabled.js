import BaseEventHandle from './base';

export default class UpdateDisabledEvent extends BaseEventHandle {
  async exec() {
    this.log('exec() start, eventHandle =', this.eventHandle, 'eventData =', this.eventData);
    // 第一版：value 只支持配置固定值（导致每次都需要配置 value=1,0 的两套条件）
    let { targetFormItemId, value } = this.eventHandle;
    // 第二版：增加 valueFrom 配置，以便让 value 取值可以支持表达式。注：当有 valueFrom 配置时，value 字段不生效
    const { valueFrom } = this.eventHandle;
    if (valueFrom) {
      if (valueFrom.type === 'condition') {
        value = await super.parseConditions(valueFrom);
      }
    }

    const condition = await super.parseConditions(this.eventHandle);
    const metadataMap = this.coreProcessor.getStore()?.state()?.metadataMap || {};
    const targetItemMetadata = metadataMap[targetFormItemId];
    if (condition && targetItemMetadata) {
      targetItemMetadata.disabled = +value;
    }
  }
}
