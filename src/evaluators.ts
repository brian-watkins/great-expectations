import { Invalid, Matcher, MatchResult } from "./matcher"
import { MatchError } from "./matchError"
import { message, problem, value } from "./message"

export type MatchEvaluator<T, S> = (value: T, description?: string) => S

export function is<T>(matcher: Matcher<T>): MatchEvaluator<T, void> {
  return (value, description) => {
    handleResult(matcher(value), description)
  }
}

export function resolvesTo<T>(matcher: Matcher<T>): MatchEvaluator<Promise<T>, Promise<void>> {
  return async (promised, description) => {
    let result
    try {
      const resolvedValue = await promised
      result = matcher(resolvedValue)
    } catch (err) {
      result = new Invalid("The promise was unexpectedly rejected.", {
        actual: problem(message`a promise that rejected with ${value(err)}`),
        expected: problem(message`a promise that resolves`)
      })
    }
    handleResult(result, description)
  }
}

export function rejectsWith<T>(matcher: Matcher<T>): MatchEvaluator<Promise<any>, Promise<void>> {
  return async (promised, description) => {
    let result
    try {
      const resolvedValue = await promised
      result = new Invalid("The promise unexpectedly resolved.", {
        actual: problem(message`a promise that resolved with ${value(resolvedValue)}`),
        expected: problem(message`a promise that rejects`)
      })
    } catch (rejectedValue: any) {
      result = matcher(rejectedValue)
    }
    handleResult(result, description)
  }
}

function handleResult(matchResult: MatchResult, description?: string) {
  switch (matchResult.type) {
    case "valid":
      return
    case "invalid":
      if (description !== undefined) {
        matchResult.description = description
      }
      throw new MatchError(matchResult)
  }
}