import { Invalid, Matcher } from "./matcher"
import { MatchError } from "./matchError"
import { message, problem, value } from "./message"

export type MatchEvaluator<T, S> = (value: T) => S

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
        actual: problem(message`a promise that rejected with ${value(err)}`),
        expected: problem(message`a promise that resolves`)
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