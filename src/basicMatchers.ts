import equal from "deep-equal"
import { expectedValue, Invalid, Matcher, MatchValues, problem, unsatisfiedExpectedValue, Valid } from "./matcher"


export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    // const values: MatchValues<T> = {
      // actual,
      // operator: "identical to",
      // argument: expected,
      // expected: problem(expected)
    // }

    if (actual === expected) {
      return new Valid({
        actual,
        expected: expectedValue(expected, "is identical to")
      })
    } else {
      // values.actual = problem(actual)
      return new Invalid("The actual value is not identical to the expected value.", {
        actual: problem(actual),
        expected: unsatisfiedExpectedValue(expected, "is identical to")
      })
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    // const values: MatchValues = {
      // actual: actual,
      // operator: "equals",
      // argument: expected,
      // expected: problem(expected)
    // }
    // const values: MatchValues<T> = 

    if (equal(actual, expected, { strict: true })) {
      return new Valid({
        actual,
        expected: expectedValue(expected, "is equal to")
      })
    } else {
      // values.actual = problem(actual)
      // values
      return new Invalid("The actual value is not equal to the expected value.", {
        actual: problem(actual),
        expected: unsatisfiedExpectedValue(expected, "is equal to")
      })
    }
  }
}
