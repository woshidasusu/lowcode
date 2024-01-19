import BaseEventHandle from './base';

/**
 * 更新指定表单项的数据源（下拉框，多选框等组件有数据源配置）
 * 有设置 saveKey 属性时，才会将解析后的数据挂载到元数据上
 * 否则只是修改元数据的数据源配置，目标组件内部需要自行监听 dataSource 的变化做响应
 * 例如：
 // components/common/form/checkboxGroup/index.vue
 watch: {
    metadata: {
    'metadata.dataSource': {
      handler: async function(newV, oldV) {
        const data = await this.coreProcessor.parseDataSource(newV);
        this.options = data || [];
      }
    }
}
 */
export default class UpdateDataSourceEvent extends BaseEventHandle {
  async exec() {
    this.log('exec() start, eventHandle =', this.eventHandle, 'eventData =', this.eventData);
    const { dataSource, targetFormItemId, saveKey } = this.eventHandle;
    const metadataMap = this.coreProcessor.getMetadataMap() || {};
    const metadata = metadataMap[targetFormItemId];
    if (metadata) {
      if (saveKey) {
        metadata[saveKey] = await this.coreProcessor.parseDataSource(dataSource, { eventData: this.eventData });
      }
      metadata.dataSource = dataSource;
    }
  }
}
