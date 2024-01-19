import BaseInitHandle from './base';

/**
 * 设置表单项的初始值
 */
export default class ModelHandle extends BaseInitHandle {
  async exec() {
    this.log('exec() start, handle =', this.handle);
    const { dataSource, targetFormId } = this.handle;
    const metadata = this.coreProcessor.getStore()?.state()?.metadataMap[this._id];
    let formModel = this.coreProcessor.getFormModel();
    if (targetFormId) {
      // 从指定组件所挂载的 formModel 对象里取数，通常用于数组子项里的场景。
      // 因为在数组里，组件 id 都是一样的，但组件对应的元数据、数据模型都是不一样的，所以增加该配置处理这种场景
      formModel = this.coreProcessor.getFormModelMap()[targetFormId];
    }
    if (metadata && formModel) {
      this.coreProcessor
        .getDataSource(dataSource)
        .exec()
        .then(value => {
          formModel[metadata.name] = value;
        });
    }
  }
}
