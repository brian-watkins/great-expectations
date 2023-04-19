import { MatchEvaluator } from "./evaluators.js"
export { is, resolvesTo, rejectsWith } from './evaluators.js'
export type { MatchEvaluator } from "./evaluators.js"
export { equalTo, identicalTo, defined, assignedWith } from "./basicMatchers.js"
export { arrayContaining, arrayWithItemAt, arrayWithLength, arrayWith } from "./arrayMatchers.js"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers.js"
export { mapContaining, mapWith } from "./mapMatchers.js"
export type { MapEntryMatcher } from "./mapMatchers.js"
export { stringMatching, stringWithLength, stringContaining } from "./stringMatchers.js"
export type { StringContainingOptions } from "./stringMatchers.js"
export { satisfying } from "./satisfyingMatchers.js"
export { objectWithProperty, objectWith } from "./objectMatchers.js"
export { Valid, Invalid } from "./matcher.js"
export type { Matcher, MatchResult, MatchValues } from "./matcher.js"

export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>, description?: string): S {
  return evaluator(value, description)
}
