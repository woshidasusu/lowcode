import ModelHandle from './model';
import DisableHandle from './disabled';
import HiddenHandle from './hidden';
import RequiredHandle from './required';
import OptionsHandle from './options';
import DataServiceHandle from './dataService';
import labelHandle from './label';

export default function getInitHandle(coreProcessor, handle, _id, extraArgs = {}) {
  const { type } = handle;
  const Cls = {
    model: ModelHandle,
    disabled: DisableHandle,
    hidden: HiddenHandle,
    required: RequiredHandle,
    options: OptionsHandle,
    dataService: DataServiceHandle,
    label: labelHandle
  }[type];
  return new Cls(coreProcessor, handle, _id, extraArgs);
}
