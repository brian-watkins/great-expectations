import { expectedMessage, Invalid, invalidActualValue, Matcher, Valid } from "./matcher"
import { matchCountMessage } from "./message"

export interface StringContainingOptions {
  caseSensitive?: boolean
  times?: number
}

export function isStringContaining(expected: string, options: StringContainingOptions = {}): Matcher<string> {
  const isCaseSensitive = options.caseSensitive ?? true
  const matchCount = options.times ?? -1

  return (actual) => {
    let actualValue = actual
    let expectedValue = expected
    if (!isCaseSensitive) {
      actualValue = actual.toLowerCase()
      expectedValue = expected.toLowerCase()
    }

    const count = getStringMatchCount(actualValue, expectedValue)

    if ((matchCount < 0 && count > 0) || (matchCount >= 0 && count == matchCount)) {
      return new Valid()
    } else {
      return new Invalid("The actual value does not contain the expected string.", {
        actual: invalidActualValue(actual),
        expected: expectedMessage(stringInvalidMessage(expected, isCaseSensitive, matchCount))
      })
    }
  }
}

function stringInvalidMessage(expected: string, isCaseSensitive: boolean, matchCount: number): string {
  let message = `a string containing '${expected}'`

  if (!isCaseSensitive) {
    message += " (case-insensitive)"
  }

  if (matchCount >= 0) {
    message += ` ${matchCountMessage(matchCount)}`
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
