import NeExpression from './ne';
import EqExpression from './eq';
import EmptyExpression from './empty';
import NotEmptyExpression from './notEmpty';
import FindInArrayExpression from './findInArray';
import NotFindInArrayExpression from './notFindInArray';

export default function getExpresstion(coreProcessor, expression, extraArgs = {}) {
  const { expression: type } = expression;
  const Cls = {
    '==': EqExpression,
    '===': EqExpression,
    '!=': NeExpression,
    '!==': NeExpression,
    empty: EmptyExpression,
    findInArray: FindInArrayExpression,
    notFindInArray: NotFindInArrayExpression,
    notEmpty: NotEmptyExpression
  }[type];
  return new Cls(coreProcessor, expression, extraArgs);
}
