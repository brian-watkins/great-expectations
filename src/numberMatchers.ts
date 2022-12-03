import { expectedMessage, Invalid, invalidActualValue, Matcher, Valid } from "./matcher";

interface NumberComparator {
  name: string
  matches(expected: number, actual: number): boolean
}

export function isNumberLessThan(expected: number): Matcher<number> {
  return numberMatcher({
    name: "less than",
    matches: (expected, actual) => actual < expected
  }, expected)
}

export function isNumberLessThanOrEqualTo(expected: number): Matcher<number> {
  return numberMatcher({
    name: "less than or equal to",
    matches: (expected, actual) => actual <= expected
  }, expected)
}

export function isNumberGreaterThan(expected: number): Matcher<number> {
  return numberMatcher({
    name: "greater than",
    matches: (expected, actual) => actual > expected
  }, expected)
}

export function isNumberGreaterThanOrEqualTo(expected: number): Matcher<number> {
  return numberMatcher({
    name: "greater than or equal to",
    matches: (expected, actual) => actual >= expected
  }, expected)
}

function numberMatcher(comparator: NumberComparator, expected: number): Matcher<number> {
  return (actual) => {
    if (comparator.matches(expected, actual)) {
      return new Valid()
    }
    return new Invalid(`The actual value is not ${comparator.name} the expected value.`, {
      actual: invalidActualValue(actual),
      expected: expectedMessage(`a number ${comparator.name} ${expected}`)
    })
  }
}