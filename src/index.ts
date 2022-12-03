import equal from "deep-equal"
import { expectedMessage, Invalid, invalidActualValue, Matcher, unsatisfiedExpectedValue, Valid } from "./matcher"
import { MatchError } from "./matchError"
import { matchCountMessage } from "./message"
export { isArrayContaining, isArrayWithLength, isArrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions } from "./arrayMatchers"

export function expect<T>(value: T, matcher: Matcher<T>): void {
  const matchResult = matcher(value)
  switch (matchResult.type) {
    case "valid":
      return
    case "invalid":
      throw new MatchError(matchResult)
  }
}

// Matchers

export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (actual === expected) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not identical to the expected value.", {
        actual: invalidActualValue(actual),
        expected: unsatisfiedExpectedValue(expected)
      })
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (equal(actual, expected, { strict: true })) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not equal to the expected value.", {
        actual: invalidActualValue(actual),
        expected: unsatisfiedExpectedValue(expected)
      })
    }
  }
}

export function isTrue(): Matcher<boolean> {
  return (actual) => {
    if (actual === true) {
      return new Valid()
    } else {
      return new Invalid("The actual value should be true, but it is not.", {
        actual: invalidActualValue(actual),
        expected: unsatisfiedExpectedValue(true)
      })
    }
  }
}

export function isFalse(): Matcher<boolean> {
  return (actual) => {
    if (actual === false) {
      return new Valid()
    } else {
      return new Invalid("The actual value should be false, but it is not.", {
        actual: invalidActualValue(actual),
        expected: unsatisfiedExpectedValue(false)
      })
    }
  }
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

interface StringContainingOptions {
  caseSensitive?: boolean
  times?: number
}