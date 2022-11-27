import equal from "deep-equal"
import { Expected, expectedMessage, expectedValue, Invalid, Matcher, Valid } from "./matcher"
import { MatchError } from "./matchError"


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
        actual,
        expected: expectedValue(expected)
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
        actual,
        expected: expectedValue(expected)
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
        actual,
        expected: expectedValue(true)
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
        actual,
        expected: expectedValue(false)
      })
    }
  }
}

export function isArrayWhere<T>(matchers: Array<Matcher<T>>): Matcher<Array<T>> {
  return (actual) => {
    if (actual.length !== matchers.length) {
      return new Invalid("The array does not have the expected length.", {
        actual,
        expected: expectedMessage(`An array with length ${matchers.length}`)
      })
    }

    let expected: Array<Expected> = []
    let failed = false
    for (let i = 0; i < actual.length; i++) {
      const itemResult = matchers[i](actual[i])
      switch (itemResult.type) {
        case "valid":
          expected.push(expectedValue(actual[i]))
          break
        case "invalid":
          failed = true
          expected.push(itemResult.values.expected)
          break
      }
    }

    if (failed) {
      return new Invalid("The array failed to match.", {
        actual,
        expected: expectedValue(expected)
      })
    } else {
      return new Valid()
    }
  }
}