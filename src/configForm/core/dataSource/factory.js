import TemplateDataSource from './template';
import WindowDataSource from './window';
import ApiDataSource from './api';
import FormModelDataSource from './formModel';
import PageUrlDataSource from './pageUrl';
import StoreDataSource from './store';
import DataServiceDataSource from './dataService';
import ConstantDataSource from './constant';
import EventContextDataSource from './eventContext';

export default function getDataSource(coreProcessor, dataSource, extraArgs = {}) {
  const { type } = dataSource;
  const Cls = {
    template: TemplateDataSource,
    api: ApiDataSource,
    window: WindowDataSource,
    formModel: FormModelDataSource,
    pageUrl: PageUrlDataSource,
    store: StoreDataSource,
    constant: ConstantDataSource,
    dataService: DataServiceDataSource,
    eventContext: EventContextDataSource
  }[type];
  return new Cls(coreProcessor, dataSource, extraArgs);
}
