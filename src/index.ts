import { MatchEvaluator } from "./evaluators"
export { is, resolvesTo, rejectsWith } from './evaluators'
export type { MatchEvaluator } from "./evaluators"
export { equalTo, identicalTo, defined } from "./basicMatchers"
export { arrayContaining, arrayWithItemAt, arrayWithLength, arrayWith } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { stringMatching, stringWithLength, stringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
export { satisfying } from "./satisfyingMatchers"
export { objectWithProperty, objectWith } from "./objectMatchers"


export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>, description?: string): S {
  return evaluator(value, description)
}
