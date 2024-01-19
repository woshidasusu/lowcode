import UpdateDisabledEvent from './updateDisabled';
import UpdateHiddenEvent from './updateHidden';
import UpdateRequiredEvent from './updateRequired';
import UpdateModelEvent from './updateModel';
import UpdateDataSourceEvent from './updateDataSource';
import CallMethodEvent from './callMethod';
import ExecFunctionEvent from './execFunction';
import ResetModelEvent from './resetModel';
import DataServiceEvent from './dataService';

export default function getEventHandle(coreProcessor, eventHandle, eventData, extraArgs = {}) {
  const { type } = eventHandle;
  const Cls = {
    updateDisabled: UpdateDisabledEvent,
    updateHidden: UpdateHiddenEvent,
    updateRequired: UpdateRequiredEvent,
    updateModel: UpdateModelEvent,
    resetModel: ResetModelEvent,
    updateDataSource: UpdateDataSourceEvent,
    callMethod: CallMethodEvent,
    execFunction: ExecFunctionEvent,
    dataService: DataServiceEvent
  }[type];
  return new Cls(coreProcessor, eventHandle, eventData, extraArgs);
}
