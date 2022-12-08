import { equals } from "./basicMatchers"
import { Description, description, Invalid, Matcher, MatchValues, problem, Valid } from "./matcher"
import { expectedCountMessage, expectedLengthMessage } from "./message"
import { isNumberGreaterThan } from "./numberMatchers"


export function isStringWithLength(expectedOrMatcher: number | Matcher<number>): Matcher<string> {
  const matcher = typeof expectedOrMatcher === "number" ? equals(expectedOrMatcher) : expectedOrMatcher

  return (actual) => {
    const result = matcher(actual.length)

    const message = description(`a string with length %expected%`, expectedLengthMessage(result.values))

    const values: MatchValues = {
      actual: actual,
      operator: "string length",
      argument: expectedOrMatcher,
      expected: message
    }

    if (result.type === "valid") {
      return new Valid(values)
    } else {
      values.actual = problem(actual)
      values.expected = problem(message)
      return new Invalid("The actual value does not have the expected length.", values)
    }
  }
}

export interface StringContainingOptions {
  caseSensitive?: boolean
  times?: number | Matcher<number>
}

export function isStringContaining(expected: string, options: StringContainingOptions = {}): Matcher<string> {
  const isCaseSensitive = options.caseSensitive ?? true
  const expectedCount = options.times

  return (actual) => {
    let actualString = actual
    let expectedString = expected
    if (!isCaseSensitive) {
      actualString = actual.toLowerCase()
      expectedString = expected.toLowerCase()
    }

    const count = getStringMatchCount(actualString, expectedString)

    let countMatcher: Matcher<number>
    if (expectedCount === undefined) {
      countMatcher = isNumberGreaterThan(0)
    } else if (typeof expectedCount === "number") {
      countMatcher = equals(expectedCount)
    } else {
      countMatcher = expectedCount
    }

    const countResult = countMatcher(count)
    
    let message: Description
    if (expectedCount === undefined) {
      message = description(stringInvalidMessage(isCaseSensitive), expected)
    } else {
      message = description(`${stringInvalidMessage(isCaseSensitive)} %expected%`, expected, expectedCountMessage(countResult.values))
    }

    const values: MatchValues = {
      actual: actual,
      operator: containsOperatorName(isCaseSensitive),
      argument: expected,
      expected: message
    }

    if (countResult.type === "valid") {
      return new Valid(values)
    } else {
      values.actual = problem(actual)
      values.expected = problem(message)
      return new Invalid("The actual value does not contain the expected string.", values)
    }
  }
}

function containsOperatorName(isCaseSensitive: boolean): string {
  return `${isCaseSensitive ? "case-sensitive" : "case-insensitive"} contains`
}

function stringInvalidMessage(isCaseSensitive: boolean): string {
  let message = `a string containing %expected%`

  if (!isCaseSensitive) {
    message += " (case-insensitive)"
  }

  return message
}

function getStringMatchCount(message: string, term: string): number {
  let searchIndex = 0
  let count = 0
  while (true) {
    const index = message.indexOf(term, searchIndex)
    if (index >= 0) {
      count++
      searchIndex = index + 1
    } else {
      break
    }
  }
  return count
}
