import { description, Expected, Invalid, mapExpectedRepresentation, Matcher, problem, Valid } from "./matcher";

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
    // const message = description(`a number ${comparator.name} %expected%`, expected)
    // const values: MatchValues = {
      // actual: actual,
      // operator: comparator.name,
      // argument: expected,
      // expected: message
    // }

    if (comparator.matches(expected, actual)) {
      return new Valid({
        actual,
        // expected: expectedValue(expected, comparator.name)
        expected: numberValue(expected, comparator.name)
      })
    } else {
      // values.actual = problem(actual)
      // values.expected = problem(message)
      return new Invalid(`The actual value is not ${comparator.name} the expected value.`, {
        actual: problem(actual),
        expected: problematicNumberValue(expected, comparator.name)
        // expected: unsatisfiedExpectedValue(expected, comparator.name)
      })
    }
  }
}

function numberValue(expected: number, operator: string): Expected<number> {
  return {
    type: "expected-value",
    matches: "a number",
    operator: operator,
    value: expected,
    representation: description(`a number that is ${operator} ${expected}`)
  }
}

function problematicNumberValue(expected: number, operator: string): Expected<number> {
  return mapExpectedRepresentation(numberValue(expected, operator), problem)
}
