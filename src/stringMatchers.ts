import { equals } from "./basicMatchers"
import { expectedMessage, Invalid, invalidActualValue, Matcher, Valid } from "./matcher"
import { expectedCountMessage } from "./message"


export function isStringWithLength(expectedOrMatcher: number | Matcher<number>): Matcher<string> {
  const matcher = typeof expectedOrMatcher === "number" ? equals(expectedOrMatcher) : expectedOrMatcher

  return (actual) => {
    const result = matcher(actual.length)
    if (result.type === "valid") {
      return new Valid()
    }

    return new Invalid("The actual value does not have the expected length.", {
      actual: invalidActualValue(actual),
      expected: expectedMessage("a string with length %expected%", result.values.expected)
    })
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
    let actualValue = actual
    let expectedValue = expected
    if (!isCaseSensitive) {
      actualValue = actual.toLowerCase()
      expectedValue = expected.toLowerCase()
    }

    const count = getStringMatchCount(actualValue, expectedValue)

    if (!expectedCount) {
      if (count > 0) {
        return new Valid()
      } else {
        return new Invalid("The actual value does not contain the expected string.", {
          actual: invalidActualValue(actual),
          expected: expectedMessage(stringInvalidMessage(expected, { isCaseSensitive }))
        })
      }
    }

    const matcher = typeof expectedCount === "number" ? equals(expectedCount) : expectedCount

    const result = matcher(count)
    if (result.type === "valid") {
      return new Valid()
    } else {
      return new Invalid("The actual value does not contain the expected string.", {
        actual: invalidActualValue(actual),
        expected: expectedMessage(stringInvalidMessage(expected, { isCaseSensitive, expectedCount }), result.values.expected)
      })
    }
  }
}

function stringInvalidMessage(expected: string, options: { isCaseSensitive: boolean, expectedCount?: number | Matcher<number> }): string {
  let message = `a string containing '${expected}'`

  if (!options.isCaseSensitive) {
    message += " (case-insensitive)"
  }

  if (options.expectedCount) {
    message += ` ${expectedCountMessage(options.expectedCount)}`
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
