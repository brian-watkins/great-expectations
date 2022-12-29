import { description, Invalid, list, Matcher, MatchResult, problem, Valid } from "./matcher";

export function satisfying<T>(matchers: Array<Matcher<T>>): Matcher<T> {
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

    const message = description("a value that satisfies all of: %expected%", list(results.map(result => result.values.expected)))

    if (failed) {
      return new Invalid("The actual value did not satisfy all of the provided matchers.", {
        actual: problem(actual),
        expected: message
      })
    } else {
      return new Valid({
        actual,
        expected: message
      })
    }
  }
}