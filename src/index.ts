import equal from "deep-equal"
import { Actual, actualValue, Expected, expectedMessage, expectedValue, Invalid, invalidActualValue, Matcher, Valid } from "./matcher"
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
        actual: invalidActualValue(actual),
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
        actual: invalidActualValue(actual),
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
        actual: invalidActualValue(actual),
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
        actual: invalidActualValue(actual),
        expected: expectedValue(false)
      })
    }
  }
}

export function isArrayWhere<T>(matchers: Array<Matcher<T>>): Matcher<Array<T>> {
  return (actual) => {
    if (actual.length !== matchers.length) {
      return new Invalid("The array does not have the expected length.", {
        actual: invalidActualValue(actual),
        expected: expectedMessage(`An array with length ${matchers.length}`)
      })
    }

    let actualValues: Array<Actual> = []
    let expected: Array<Expected> = []
    let errorMessages: Array<ArrayMatchMessage> = []
    for (let i = 0; i < actual.length; i++) {
      const itemResult = matchers[i](actual[i])
      switch (itemResult.type) {
        case "valid":
          actualValues.push(actualValue(actual[i]))
          expected.push(expectedValue(actual[i]))
          break
        case "invalid":
          errorMessages.push({ index: i, message: itemResult.description })
          actualValues.push(itemResult.values.actual)
          expected.push(itemResult.values.expected)
          break
      }
    }

    if (errorMessages.length > 0) {
      return new Invalid(`The array failed to match:\n\n${errorMessages.map(e => `  at Actual[${e.index}]: ${e.message}`).join("\n\n")}`, {
        actual: actualValue(actualValues),
        expected: expectedValue(expected)
      })
    } else {
      return new Valid()
    }
  }
}

interface ArrayMatchMessage {
  index: number
  message: string
}