import { expectedMessage, Invalid, invalidActualValue, Matcher, Valid } from "./matcher";

export function isNumberLessThan(expected: number): Matcher<number> {
  return (actual) => {
    if (actual < expected) {
      return new Valid()
    }
    return new Invalid("The actual value is not less than the expected value.", {
      actual: invalidActualValue(actual),
      expected: expectedMessage(`a number less than ${expected}`)
    })
  }
}