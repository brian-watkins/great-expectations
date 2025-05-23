import { equalTo } from "./basicMatchers.js"
import { countMatches, matchWithoutOrder } from "./matchCollection.js"
import { Invalid, Matcher, MatchValues, Valid } from "./matcher.js"
import { Message, message, problem, times, value } from "./message.js"
import { isNumberGreaterThan } from "./numberMatchers.js"

export function arrayWithLength<T>(expectedLength: number): Matcher<Array<T>> {
  return (actual) => {
    const expectedMessage = message`an array with ${times(expectedLength, "element")}`

    if (expectedLength === actual.length) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    } else {
      return new Invalid(`The array length (${actual.length}) is unexpected.`, {
        actual: problem(actual),
        expected: problem(expectedMessage)
      })
    }
  }
}

export function arrayWithItemAt<T>(index: number, matcher: Matcher<NoInfer<T>>): Matcher<Array<T>> {
  return (actual) => {
    if (actual.length <= index) {
      return new Invalid(`The array has no item at index ${index}.`, {
        actual: problem(actual),
        expected: problem(message`an array with some item at index ${index}`)
      })
    }

    const result = matcher(actual[index])

    const expectedMessage = message`an array where the item at index ${index} is ${result.values.expected}`

    switch (result.type) {
      case "valid":
        return new Valid({
          actual: value(actual),
          expected: expectedMessage
        })
      case "invalid":
        return new Invalid(`The item at index ${index} did not match.`, {
          actual: value(actual.map((val, i) => i === index ? problem(val) : val)),
          expected: problem(expectedMessage)
        })
    }
  }
}

export interface ArrayWhereOptions {
  withAnyOrder?: boolean
}

export function arrayWith<T>(matchers: Array<Matcher<NoInfer<T>>>, options: ArrayWhereOptions = {}): Matcher<Array<T>> {
  const allowAnyOrder = options.withAnyOrder ?? false

  return (actual) => {
    const lengthResult = arrayWithLength<T>(matchers.length)(actual)

    if (lengthResult.type === "invalid") {
      return lengthResult
    }

    if (allowAnyOrder) {
      return isUnorderedArrayWhere(matchers)(actual)
    } else {
      return isOrderedArrayWhere(matchers)(actual)
    }
  }
}

function isOrderedArrayWhere<T>(matchers: Array<Matcher<T>>): Matcher<Array<T>> {
  return (actual) => {
    let actualValues: Array<any> = []
    let expected: Array<any> = []
    let failures: number = 0
    for (let i = 0; i < actual.length; i++) {
      const itemResult = matchers[i](actual[i])
      actualValues.push(itemResult.values.actual)
      expected.push(itemResult.values.expected)
      if (itemResult.type === "invalid") {
        failures++
      }
    }

    if (failures > 0) {
      return new Invalid("The array failed to match.", {
        actual: value(actualValues),
        expected: value(expected)
      })
    } else {
      return new Valid({
        actual: value(actualValues),
        expected: value(expected)
      })
    }
  }
}

function isUnorderedArrayWhere<T>(matchers: Array<Matcher<T>>): Matcher<Array<T>> {
  return (actual) => {
    const accumulatedResult = matchWithoutOrder(actual, matchers)

    const actualValues = actual.map((item) => {
      if (accumulatedResult.items.includes(item)) {
        return problem(item)
      } else {
        return item
      }
    })

    if (accumulatedResult.failed) {
      return new Invalid("The array failed to match.", {
        actual: value(actualValues),
        expected: value(accumulatedResult.expected)
      })
    } else {
      return new Valid({
        actual: value(actualValues),
        expected: value(accumulatedResult.expected)
      })
    }
  }
}

export interface ArrayContainingOptions {
  times?: number
}

export function arrayContaining<T>(matcher: Matcher<NoInfer<T>>, options: ArrayContainingOptions = {}): Matcher<Array<T>> {
  const expectedMatchCount = options.times

  return (actual) => {
    if (actual.length === 0) {
      return new Invalid("The array does not contain the expected element.", {
        actual: problem(actual),
        expected: problem(message`an array that contains at least 1 element`)
      })
    }

    const results = countMatches(actual, matcher)

    let countMatcher: Matcher<number>
    if (expectedMatchCount === undefined) {
      countMatcher = isNumberGreaterThan(0)
    } else {
      countMatcher = equalTo(expectedMatchCount)
    }

    const countResult = countMatcher(results.matchCount)

    if (countResult.type === "valid") {
      return new Valid({
        actual: value(actual),
        expected: arrayContainsMessage(expectedMatchCount, results.lastValid)
      })
    } else {
      return new Invalid("The array does not contain the expected element.", {
        actual: problem(actual),
        expected: problem(arrayContainsMessage(expectedMatchCount, results.lastInvalid))
      })
    }
  }
}

function arrayContainsMessage(expectedMatchCount: number | undefined, matchValues: MatchValues | undefined): Message {
  return (expectedMatchCount === undefined)
    ? message`an array that contains ${matchValues?.expected}`
    : message`an array that contains, ${times(expectedMatchCount)}, ${matchValues?.expected}`
}