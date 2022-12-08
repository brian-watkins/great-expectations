import equal from "deep-equal"
import { Invalid, Matcher, MatchValues, problem, Valid } from "./matcher"


export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    const values: MatchValues = {
      actual,
      operator: "identical to",
      argument: expected,
      expected: problem(expected)
    }

    if (actual === expected) {
      return new Valid(values)
    } else {
      values.actual = problem(actual)
      return new Invalid("The actual value is not identical to the expected value.", values)
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    const values: MatchValues = {
      actual: actual,
      operator: "equals",
      argument: expected,
      expected: problem(expected)
    }

    if (equal(actual, expected, { strict: true })) {
      return new Valid(values)
    } else {
      values.actual = problem(actual)
      return new Invalid("The actual value is not equal to the expected value.", values)
    }
  }
}
