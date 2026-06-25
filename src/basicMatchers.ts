import equal from "deep-equal"
import { Invalid, matcher, Matcher, Valid } from "./matcher.js"
import { message, problem, typeName, value } from "./message.js"


export function identicalTo<T>(expected: NoInfer<T>): Matcher<T> {
  const expectedMessage = expected === undefined ?
    message`a variable that is undefined` :
    message`${typeName(expected)} that is identical to ${value(expected)}`

  return matcher(expectedMessage, (actual) => {
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
  })
}

export function equalTo<T>(expected: NoInfer<T>): Matcher<T> {
  const expectedMessage = expected === undefined ?
    message`a variable that is undefined` :
    message`${typeName(expected)} that equals ${value(expected)}`

  return matcher(expectedMessage, (actual) => {
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
  })
}

export function defined(): Matcher<any> {
  const expectedMessage = message`a value that is defined`

  return matcher(expectedMessage, (actual) => {
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
  })
}

export function assignedWith<T>(assignment: Matcher<NoInfer<T>>): Matcher<T | undefined> {
  const description = message`a variable that is assigned ${assignment.expects}`
  
  return matcher(description, (actual) => {
    if (actual === undefined) {
      return new Invalid("The actual variable is not assigned a value.", {
        actual: problem(actual),
        expected: problem(description)
      })
    }

    return assignment(actual)
  })
}