import equal from "deep-equal"
import { actualValue, Invalid, invalidActualValue, Matcher, unsatisfiedExpectedValue, Valid } from "./matcher"


export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    const values = {
      actual: actualValue(actual),
      operator: "identical to",
      argument: expected,
      expected: unsatisfiedExpectedValue(expected)
    }

    if (actual === expected) {
      return new Valid(values)
    } else {
      values.actual = invalidActualValue(actual)
      return new Invalid("The actual value is not identical to the expected value.", values)
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    const values = {
      actual: actualValue(actual),
      operator: "equals",
      argument: expected,
      expected: unsatisfiedExpectedValue(expected)
    }

    if (equal(actual, expected, { strict: true })) {
      return new Valid(values)
    } else {
      values.actual = invalidActualValue(actual)
      return new Invalid("The actual value is not equal to the expected value.", values)
    }
  }
}
