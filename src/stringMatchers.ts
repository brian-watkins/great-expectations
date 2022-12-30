import { equalTo } from "./basicMatchers"
import { Invalid, Matcher, Valid } from "./matcher"
import { Message, message, problem, timesMessage, value } from "./message"
import { isNumberGreaterThan } from "./numberMatchers"


export function stringMatching(regex: RegExp): Matcher<string> {
  return (actual) => {
    const expectedMessage = message`a string matching ${regex.toString()}`

    if (regex.test(actual)) {
      return new Valid({
        actual,
        expected: expectedMessage
      })
    } else {
      return new Invalid("The actual value does not match the regular expression.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  }
}

export function stringWithLength(expectedLength: number): Matcher<string> {
  return (actual) => {
    const expectedMessage = message`a string with length ${expectedLength}`

    if (expectedLength === actual.length) {
      return new Valid({
        actual,
        expected: expectedMessage
      })
    } else {
      return new Invalid("The actual value does not have the expected length.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  }
}

export interface StringContainingOptions {
  caseSensitive?: boolean
  times?: number
}

export function stringContaining(expected: string, options: StringContainingOptions = {}): Matcher<string> {
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
    let message: Message
    if (expectedCount === undefined) {
      countMatcher = isNumberGreaterThan(0)
      message = stringInvalidMessage(isCaseSensitive, expected)
    } else {
      countMatcher = equalTo(expectedCount)
      message = stringInvalidMessage(isCaseSensitive, expected, expectedCount)
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

function stringInvalidMessage(isCaseSensitive: boolean, expected: any, expectedCount?: number): Message {
  return message`a string that contains${
    isCaseSensitive ? "" : " (case-insensitive)"
  } ${value(expected)}${
    expectedCount !== undefined ? " " + timesMessage(expectedCount) : ""
  }`
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
