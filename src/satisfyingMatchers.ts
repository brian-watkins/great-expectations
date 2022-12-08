import { description, Invalid, Matcher, MatchResult, MatchValues, problem, Valid } from "./matcher";

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
      message += "\n  • %expected%"
    }

    const values: MatchValues = {
      actual: actual,
      operator: "satisfying all",
      argument: matchers,
      expected: description(message, ...results.map(result => result.values.expected))
    }

    if (failed) {
      values.actual = problem(actual)
      return new Invalid("The actual value did not satisfy all of the provided matchers.", values)
    } else {
      return new Valid(values)
    }
  }
}