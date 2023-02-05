import equal from "deep-equal"
import { Invalid, Matcher, Valid } from "./matcher"
import { message, problem, typeName, value } from "./message"


export function identicalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    const expectedMessage = message`${typeName(expected)} that is identical to ${value(expected)}`

    if (actual === expected) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    } else {
      return new Invalid("The actual value is not identical to the expected value.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  }
}

export function equalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    const expectedMessage = message`${typeName(expected)} that equals ${value(expected)}`

    if (equal(actual, expected, { strict: true })) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    } else {
      return new Invalid("The actual value is not equal to the expected value.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  }
}

export function defined(): Matcher<any> {
  return (actual) => {
    const expectedMessage = message`a value that is defined`

    if (actual === undefined) {
      return new Invalid("The actual value is not defined.", {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    } else {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    }
  }
}

export function assignedWith<T>(matcher: Matcher<T>): Matcher<T | undefined> {
  return (actual) => {
    if (actual === undefined) {
      return new Invalid("The actual variable is not assigned a value.", {
        actual: problem(actual),
        expected: problem(message`a variable that is assigned a value`)
      })
    }

    return matcher(actual)
  }
}