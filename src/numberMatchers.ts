import { expectedMessage, Invalid, invalidActualValue, Matcher, Valid } from "./matcher";

interface NumberComparator {
  name: string
  matches(expected: number, actual: number): boolean
}

const LessThan: NumberComparator = {
  name: "less than",
  matches: (expected, actual) => actual < expected
}

const LessThanOrEqualTo: NumberComparator = {
  name: "less than or equal to",
  matches: (expected, actual) => actual <= expected
}

const GreaterThan: NumberComparator = {
  name: "greater than",
  matches: (expected, actual) => actual > expected
}

export function isNumberLessThan(expected: number): Matcher<number> {
  return numberMatcher(LessThan, expected)
}

export function isNumberLessThanOrEqualTo(expected: number): Matcher<number> {
  return numberMatcher(LessThanOrEqualTo, expected)
}

export function isNumberGreaterThan(expected: number): Matcher<number> {
  return numberMatcher(GreaterThan, expected)
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