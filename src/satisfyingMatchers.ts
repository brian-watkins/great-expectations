import { Invalid, Matcher, MatchResult, Valid } from "./matcher.js";
import { list, message, problem, value } from "./message.js";

export function satisfying<T>(matchers: Array<Matcher<NoInfer<T>>>): Matcher<T> {
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

    const expectedMessage = message`a value that satisfies all of: ${list(results.map(result => result.values.expected))}`

    if (failed) {
      return new Invalid("The actual value did not satisfy all of the provided matchers.", {
        actual: problem(actual),
        expected: expectedMessage
      })
    } else {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    }
  }
}