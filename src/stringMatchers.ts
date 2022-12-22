import { equals } from "./basicMatchers"
import { Description, description, Invalid, Matcher, problem, Valid } from "./matcher"
import { timesMessage } from "./message"
import { isNumberGreaterThan } from "./numberMatchers"


export function isStringMatching(regex: RegExp): Matcher<string> {
  return (actual) => {
    const message = description(`a string matching ${regex.toString()}`)

    if (regex.test(actual)) {
      return new Valid({
        actual,
        expected: message
      })
    } else {
      return new Invalid("The actual value does not match the regular expression.", {
        actual: problem(actual),
        expected: problem(message)
      })
    }
  }
}

export function isStringWithLength(expectedLength: number): Matcher<string> {
  return (actual) => {
    const message = description(`a string with length %expected%`, expectedLength)

    if (expectedLength === actual.length) {
      return new Valid({
        actual,
        expected: message
      })
    } else {
      return new Invalid("The actual value does not have the expected length.", {
        actual: problem(actual),
        expected: problem(message)
      })
    }
  }
}

export interface StringContainingOptions {
  caseSensitive?: boolean
  times?: number
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
    let message: Description
    if (expectedCount === undefined) {
      countMatcher = isNumberGreaterThan(0)
      message = description(stringInvalidMessage(isCaseSensitive), expected)
    } else {
      countMatcher = equals(expectedCount)
      message = description(`${stringInvalidMessage(isCaseSensitive)} ${timesMessage(expectedCount)}`, expected)
    }

    const countResult = countMatcher(count)
    
    if (countResult.type === "valid") {
      return new Valid({
        actual,
        expected: message
      })
    } else {
      return new Invalid("The actual value does not contain the expected string.", {
        actual: problem(actual),
        expected: problem(message)
      })
    }
  }
}

function stringInvalidMessage(isCaseSensitive: boolean): string {
  let message = `a string that contains`

  if (!isCaseSensitive) {
    message += " (case-insensitive)"
  }

  message += " %expected%"

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
