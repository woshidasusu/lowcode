import ExpressionCondition from './expression';
import ExecFunctionCondition from './execFunction';
import DataServiceCondition from './dataService';
import GrayPublishCondition from './grayPublish';

export default function getCondition(coreProcessor, condition, extraArgs = {}) {
  const { type } = condition;
  const Cls = {
    expression: ExpressionCondition,
    execFunction: ExecFunctionCondition,
    dataService: DataServiceCondition,
    grayPublish: GrayPublishCondition
  }[type];
  return new Cls(coreProcessor, condition, extraArgs);
}
