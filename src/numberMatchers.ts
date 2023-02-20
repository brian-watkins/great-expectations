import { Invalid, Matcher, Valid } from "./matcher.js";
import { message, problem, value } from "./message.js";

export function isNumberGreaterThan(expected: number): Matcher<number> {
  return (actual) => {
    const expectedMessage = message`a number greater than ${value(expected)}`

    if (actual > expected) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    } else {
      return new Invalid("The actual value is not greater than the expected value.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  }
}
