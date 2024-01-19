import BaseInitHandle from './base';

/**
 * 设置表单项的label
 */
export default class LabelHandle extends BaseInitHandle {
  async exec() {
    this.log('exec() start, handle =', this.handle);
    const { value } = this.handle;
    const metadata = this.coreProcessor.getStore()?.state()?.metadataMap[this._id];
    if (metadata) {
      metadata.label = value;
    }
  }
}
