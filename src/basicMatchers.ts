import equal from "deep-equal"
import { description, Invalid, Matcher, problem, Valid } from "./matcher"
import { typeName } from "./message"


export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (actual === expected) {
      return new Valid({
        actual,
        expected: description(`${typeName(expected)} that is identical to %expected%`, expected)
      })
    } else {
      return new Invalid("The actual value is not identical to the expected value.", {
        actual: problem(actual),
        expected: problem(description(`${typeName(expected)} that is identical to %expected%`, expected))
      })
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (equal(actual, expected, { strict: true })) {
      return new Valid({
        actual,
        expected: description(`${typeName(expected)} that equals %expected%`, expected)
      })
    } else {
      return new Invalid("The actual value is not equal to the expected value.", {
        actual: problem(actual),
        expected: problem(description(`${typeName(expected)} that equals %expected%`, expected))
      })
    }
  }
}
