import { equalTo } from "./basicMatchers.js"
import { Invalid, Matcher, MatchResult } from "./matcher.js"
import { MatchError } from "./matchError.js"
import { message, problem, value } from "./message.js"

export type MatchEvaluator<T, S> = (value: T, description?: string) => S

export function is<T>(matcher: NoInfer<T> | Matcher<NoInfer<T>>): MatchEvaluator<T, void> {
  return (value, description) => {
    if (isMatcher(matcher)) {
      handleResult(matcher(value), description)
    } else {
      handleResult(equalTo(matcher)(value), description)
    }
  }
}

function isMatcher<T>(value: T | Matcher<T>): value is Matcher<T> {
  return typeof (value) === "function"
}

export function throws<T>(matcher: NoInfer<T> | Matcher<NoInfer<T>>): MatchEvaluator<() => void, void> {
  return (thunk, description) => {
    let didThrow = false
    let result: MatchResult
    try {
      thunk()
    } catch (err: any) {
      didThrow = true
      if (isMatcher(matcher)) {
        result = matcher(err)
      } else {
        result = equalTo(matcher)(err)
      }
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

export function resolvesTo<T>(matcher: NoInfer<T> | Matcher<NoInfer<T>>): MatchEvaluator<Promise<T>, Promise<void>> {
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
        actual: problem(message`a promise that rejected with:\n\n${value(err)}`),
        expected: problem(message`a promise that resolves`)
      })
    }
    handleResult(result, description)
  }
}

export function rejectsWith<T>(matcher: NoInfer<T> | Matcher<NoInfer<T>>): MatchEvaluator<Promise<any>, Promise<void>> {
  return async (promised, description) => {
    let result
    try {
      const resolvedValue = await promised
      result = new Invalid("The promise unexpectedly resolved.", {
        actual: problem(message`a promise that resolved with ${value(resolvedValue)}`),
        expected: problem(message`a promise that rejects`)
      })
    } catch (rejectedValue: any) {
      if (isMatcher(matcher)) {
        result = matcher(rejectedValue)
      } else {
        result = equalTo(matcher)(rejectedValue)
      }
    }
    handleResult(result, description)
  }
}

export interface EventuallyOptions {
  timeout?: number
  waitFor?: number
}

export function eventually<T, S>(evaluator: MatchEvaluator<NoInfer<T>, S>, options: EventuallyOptions = {}): MatchEvaluator<() => T, Promise<void>> {
  const resolvedOptions = { timeout: 500, waitFor: 30, ...options }

  return async (value, description) => {
    const start = Date.now()
    let lastFailure: MatchError | undefined

    let count = 0
    while (Date.now() - start < resolvedOptions.timeout) {
      try {
        await evaluator(value(), description)
        return
      } catch (err: any) {
        count++
        lastFailure = err
        await new Promise(resolve => setTimeout(resolve, resolvedOptions.waitFor))
      }
    }

    const result = new Invalid(
      `The value did not match after ${count} attempts over ${resolvedOptions.timeout}ms.`,
      lastFailure!.invalid.values
    )

    throw handleResult(result, description)
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