import { actualValue, expectedMessage, expectedValue, Invalid, invalidActualValue, Matcher, unsatisfiedExpectedValue, Valid } from "./matcher";

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
    const values = {
      actual: actualValue(actual),
      operator: comparator.name,
      argument: expected,
      expected: expectedValue(expectedMessage(`a number %expected%`, expectedValue(expectedMessage(`${comparator.name} %expected%`, expectedValue(expected)))))
    }

    if (comparator.matches(expected, actual)) {
      return new Valid(values)
    } else {
      values.actual = invalidActualValue(actual)
      values.expected = expectedValue(expectedMessage(`a number %expected%`, unsatisfiedExpectedValue(expectedMessage(`${comparator.name} %expected%`, expectedValue(expected)))))
      return new Invalid(`The actual value is not ${comparator.name} the expected value.`, values)
    }
  }
}