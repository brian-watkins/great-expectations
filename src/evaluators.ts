import { equalTo } from "./basicMatchers.js"
import { Invalid, Matcher, MatchResult } from "./matcher.js"
import { MatchError } from "./matchError.js"
import { message, problem, value } from "./message.js"

export type MatchEvaluator<T, S> = (value: T, description?: string) => S

export function is<T>(matcher: T | Matcher<T>): MatchEvaluator<T, void> {
  return (value, description) => {
    if (isMatcher(matcher)) {
      handleResult(matcher(value), description)
    } else {
      handleResult(equalTo(matcher)(value), description)
    }

  }
}

function isMatcher<T>(value: T | Matcher<T>): value is Matcher<T> {
  return typeof(value) === "function"
}

export function throws<T>(matcher: Matcher<T>): MatchEvaluator<() => void, void> {
  return (thunk, description) => {
    let didThrow = false
    let result: MatchResult
    try {
      thunk()
    } catch (err: any) {
      didThrow = true
      result = matcher(err)
    } finally {
      if (!didThrow) {
        result = new Invalid("The function did not throw.", {
          actual: problem(message`a function that did not throw`),
          expected: problem(message`a function that throws`)
        })
      }
    }
    handleResult(result!, description)
  }
}

export function resolvesTo<T>(matcher: T | Matcher<T>): MatchEvaluator<Promise<T>, Promise<void>> {
  return async (promised, description) => {
    let result
    try {
      const resolvedValue = await promised
      if (isMatcher(matcher)) {
        result = matcher(resolvedValue)
      } else {
        result = equalTo(matcher)(resolvedValue)
      }
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