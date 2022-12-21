import { description, Invalid, Matcher, MatchResult, problem, Valid } from "./matcher";

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

    if (failed) {
      return new Invalid("The actual value did not satisfy all of the provided matchers.", {
        actual: problem(actual),
        expected: description(message, ...results.map(result => result.values.expected))
      })
    } else {
      return new Valid({
        actual,
        expected: description(message, ...results.map(result => result.values.expected))
      })
    }
  }
}