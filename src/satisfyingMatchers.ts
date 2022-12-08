import { actualValue, expectedMessage, expectedValue, Invalid, invalidActualValue, Matcher, MatchResult, Valid } from "./matcher";

export function satisfyingAll<T>(matchers: Array<Matcher<T>>): Matcher<T> {
  return (actual) => {
    let failed = false
    let results: Array<MatchResult> = []
    for (const matcher of matchers) {
      const result = matcher(actual)
      if (result.type === "invalid") {
        failed = true
      }
      results.push(result)
    }

    let message = "a value that satisfies all of:"
    for (let i = 0; i < matchers.length; i++) {
      message += "\n  ~ %expected%"
    }

    const values = {
      actual: actualValue(actual),
      operator: "satisfying all",
      argument: matchers,
      expected: expectedValue(expectedMessage(message, ...results.map(result => result.values.expected)))
    }

    if (failed) {
      values.actual = invalidActualValue(actual)
      return new Invalid("The actual value did not satisfy all of the provided matchers.", values)
    } else {
      return new Valid(values)
    }
  }
}