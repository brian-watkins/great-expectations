import { MatchEvaluator } from "./evaluators"
export { is, resolvesTo } from './evaluators'
export type { MatchEvaluator } from "./evaluators"
export { equalTo, identicalTo, defined } from "./basicMatchers"
export { arrayContaining, arrayWhereItemAt, arrayWithLength, arrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { stringMatching, stringWithLength, stringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
export { satisfying } from "./satisfyingMatchers"
export { objectWithProperty, objectWhere } from "./objectMatchers"


export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>): S {
  return evaluator(value)
}
