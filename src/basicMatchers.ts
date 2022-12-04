import equal from "deep-equal"
import { Invalid, invalidActualValue, Matcher, unsatisfiedExpectedValue, Valid } from "./matcher"


export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (actual === expected) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not identical to the expected value.", {
        actual: invalidActualValue(actual),
        operator: "identical to",
        argument: expected,
        expected: unsatisfiedExpectedValue(expected)
      })
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (equal(actual, expected, { strict: true })) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not equal to the expected value.", {
        actual: invalidActualValue(actual),
        operator: "equals",
        argument: expected,
        expected: unsatisfiedExpectedValue(expected)
      })
    }
  }
}
