import { equalTo } from "./basicMatchers.js"
import { Invalid, matcher, Matcher, Valid } from "./matcher.js"
import { Message, message, problem, times, value } from "./message.js"
import { isNumberGreaterThan } from "./numberMatchers.js"

export interface StringMatchingOptions {
  times?: number
}

export function stringMatching(regex: RegExp, options: StringMatchingOptions = {}): Matcher<string> {
  const expectedMessage = options.times === undefined ?
      message`a string matching ${regex.toString()}` :
      message`a string matching ${regex.toString()} ${times(options.times)}`

  return matcher(expectedMessage, (actual) => {
    const matches = actual.match(regex) ?? []

    if (options.times === undefined && matches.length >= 1) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    }

    if (options.times !== undefined && matches.length === options.times) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    }

    return new Invalid("The actual value does not match the regular expression.", {
      actual: problem(actual),
      expected: problem(expectedMessage)
    })
  })
}

export function stringWithLength(expectedLength: number): Matcher<string> {
  const expectedMessage = message`a string with length ${expectedLength}`

  return matcher(expectedMessage, (actual) => {
    if (expectedLength === actual.length) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    } else {
      return new Invalid("The actual value does not have the expected length.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  })
}

export interface StringContainingOptions {
  caseSensitive?: boolean
  times?: number
}

export function stringContaining(expected: string, options: StringContainingOptions = {}): Matcher<string> {
  const isCaseSensitive = options.caseSensitive ?? true
  const expectedCount = options.times
  const description = stringInvalidMessage(isCaseSensitive, expected, expectedCount)

  return matcher(description, (actual) => {
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
    } else {
      countMatcher = equalTo(expectedCount)
    }

    const countResult = countMatcher(count)

    if (countResult.type === "valid") {
      return new Valid({
        actual: value(actual),
        expected: description
      })
    } else {
      return new Invalid("The actual value does not contain the expected string.", {
        actual: problem(actual),
        expected: problem(description)
      })
    }
  })
}

function stringInvalidMessage(isCaseSensitive: boolean, expected: string, expectedCount?: number): Message {
  const operator = isCaseSensitive ? "contains" : "contains (case-insensitive)"

  if (expectedCount !== undefined) {
    return message`a string that ${operator} ${value(expected)} ${times(expectedCount)}`
  } else {
    return message`a string that ${operator} ${value(expected)}`
  }
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
