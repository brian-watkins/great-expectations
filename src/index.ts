import { description, Invalid, Matcher, problem } from "./matcher"
import { MatchError } from "./matchError"
export { equals, isIdenticalTo, isDefined } from "./basicMatchers"
export { isArrayContaining, isArrayWhereItemAt, isArrayWithLength, isArrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { isStringMatching, isStringWithLength, isStringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
export { satisfyingAll } from "./satisfyingMatchers"

type MatchEvaluator<T, S> = (value: T) => S

export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>): S {
  return evaluator(value)
}

export function is<T>(matcher: Matcher<T>): MatchEvaluator<T, void> {
  return (value) => {
    evaluateMatch(value, matcher)
  }
}

export function resolvesTo<T>(matcher: Matcher<T>): MatchEvaluator<Promise<T>, Promise<void>> {
  return async (promised) => {
    let resolvedValue
    try {
      resolvedValue = await promised
    } catch (err) {
      throw new MatchError(new Invalid("The promise was unexpectedly rejected.", {
        actual: problem(description("a promise that rejected with %expected%", err)),
        expected: problem(description("a promise that resolves"))
      }))
    }
    evaluateMatch(resolvedValue, matcher)
  }
}

function evaluateMatch<T>(value: T, matcher: Matcher<T>) {
  const matchResult = matcher(value)
  switch (matchResult.type) {
    case "valid":
      return
    case "invalid":
      throw new MatchError(matchResult)
  }
}