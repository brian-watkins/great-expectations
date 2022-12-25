import { MatchEvaluator } from "./evaluators"
export { is, resolvesTo } from './evaluators'
export type { MatchEvaluator } from "./evaluators"
export { equals, isIdenticalTo, isDefined } from "./basicMatchers"
export { isArrayContaining, isArrayWhereItemAt, isArrayWithLength, isArrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { isStringMatching, isStringWithLength, isStringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
export { satisfyingAll } from "./satisfyingMatchers"
export { isObjectWithProperty } from "./objectMatchers"


export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>): S {
  return evaluator(value)
}
