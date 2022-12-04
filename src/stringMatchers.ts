import { equals } from "./basicMatchers"
import { actualValue, Expected, expectedMessage, expectedValue, Invalid, invalidActualValue, Matcher, Valid } from "./matcher"
import { expectedCountMessage, expectedLengthMessage } from "./message"
import { isNumberGreaterThan } from "./numberMatchers"


export function isStringWithLength(expectedOrMatcher: number | Matcher<number>): Matcher<string> {
  const matcher = typeof expectedOrMatcher === "number" ? equals(expectedOrMatcher) : expectedOrMatcher

  return (actual) => {
    const result = matcher(actual.length)

    const values = {
      actual: actualValue(actual),
      operator: "string length",
      argument: expectedOrMatcher,
      expected: expectedMessage(`a string with length %expected%`, expectedLengthMessage(result.values))
    }

    if (result.type === "valid") {
      return new Valid(values)
    } else {
      values.actual = invalidActualValue(actual)
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
    
    let message: Expected
    if (expectedCount === undefined) {
      message = expectedMessage(stringInvalidMessage(isCaseSensitive), expectedValue(expected))
    } else {
      message = expectedMessage(`${stringInvalidMessage(isCaseSensitive)} %expected%`, expectedValue(expected), expectedCountMessage(countResult.values))
    }

    const values = {
      actual: actualValue(actual),
      operator: containsOperatorName(isCaseSensitive),
      argument: expected,
      expected: message
    }

    if (countResult.type === "valid") {
      return new Valid(values)
    } else {
      values.actual = invalidActualValue(actual)
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
