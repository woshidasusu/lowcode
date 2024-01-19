import BaseDataSource from './base';
/**
 *  从 formModel 表单数据模型上取数
 */
export default class FormModelDataSource extends BaseDataSource {
  async exec() {
    this.log('exec() start, dataSource =', this.dataSource, 'eventData =', this.eventData);
    const { dataKey, targetFormId } = this.dataSource;
    let result = this.coreProcessor.getFormModel();
    if (targetFormId) {
      // 从指定组件所挂载的 formModel 对象里取数，通常用于数组子项里的场景。
      // 因为在数组里，组件 id 都是一样的，但组件对应的元数据、数据模型都是不一样的，所以增加该配置处理这种场景
      result = this.coreProcessor.getFormModelMap()[targetFormId];
    }
    // dataKey 支持设置 . 来取内嵌字段
    const dataKeys = dataKey?.split('.');
    while (dataKeys?.length > 0) {
      if (result == null) {
        console.error('[FormModelDataSource]', dataKey + ' 读取异常，请检查数据结构');
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    this.log('exec() return', result);
    return result;
  }
}
