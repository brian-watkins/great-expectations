import { description, Invalid, Matcher, problem, Valid } from "./matcher";

export function isNumberGreaterThan(expected: number): Matcher<number> {
  return (actual) => {
    const message = description("a number greater than %expected%", expected)

    if (actual > expected) {
      return new Valid({
        actual,
        expected: message
      })
    } else {
      return new Invalid("The actual value is not greater than the expected value.", {
        actual: problem(actual),
        expected: problem(message)
      })
    }
  }
}
