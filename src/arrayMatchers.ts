import { equals } from "./basicMatchers"
import { Description, description, Invalid, Matcher, MatchValues, problem, Valid } from "./matcher"
import { timesMessage } from "./message"
import { isNumberGreaterThan } from "./numberMatchers"

export function isArrayWithLength<T>(expectedLength: number): Matcher<Array<T>> {
  return (actual) => {
    const message = description("an array with length %expected%", expectedLength)

    if (expectedLength === actual.length) {
      return new Valid({
        actual,
        expected: message
      })
    } else {
      return new Invalid(`The array length (${actual.length}) is unexpected.`, {
        actual: problem(actual),
        expected: problem(message)
      })
    }
  }
}

export function isArrayWhereItemAt<T>(index: number, matcher: Matcher<T>): Matcher<Array<T>> {
  return (actual) => {
    if (actual.length <= index) {
      return new Invalid(`The array has no item at index ${index}.`, {
        actual: problem(actual),
        expected: problem(description(`an array with some item to check at index ${index}`))
      })
    }

    const result = matcher(actual[index])

    const message = description(`an array where the item at index ${index} is %expected%`, result.values.expected)

    switch (result.type) {
      case "valid":
        return new Valid({
          actual,
          expected: message
        })
      case "invalid":
        return new Invalid(`The item at index ${index} did not match.`, {
          actual: actual.map((val, i) => i === index ? problem(val) : val),
          expected: problem(message)
        })
    }
  }
}

export interface ArrayWhereOptions {
  withAnyOrder?: boolean
}

export function isArrayWhere<T>(matchers: Array<Matcher<T>>, options: ArrayWhereOptions = {}): Matcher<Array<T>> {
  const allowAnyOrder = options.withAnyOrder ?? false

  return (actual) => {
    const lengthResult = isArrayWithLength<T>(matchers.length)(actual)

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
    let errorMessages: Array<ArrayMatchMessage> = []
    for (let i = 0; i < actual.length; i++) {
      const itemResult = matchers[i](actual[i])
      switch (itemResult.type) {
        case "valid":
          actualValues.push(itemResult.values.actual)
          expected.push(itemResult.values.expected)
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
        actual: actualValues,
        expected: expected
      })
    } else {
      return new Valid({
        actual: actualValues,
        expected: expected
      })
    }
  }
}

interface UnorderedAccumulator<T> {
  items: Array<T>
  expected: Array<any>
  failed: boolean
}

function isUnorderedArrayWhere<T>(matchers: Array<Matcher<T>>): Matcher<Array<T>> {
  return (actual) => {
    const accumulatedResult = matchers.reduce((acc: UnorderedAccumulator<T>, matcher: Matcher<T>) => {
      let invalid: Invalid
      for (let x = 0; x < acc.items.length; x++) {
        const result = matcher(acc.items[x])
        if (result.type === "valid") {
          return {
            items: acc.items.filter((_: T, index: number) => index !== x),
            expected: acc.expected.concat([result.values.expected]),
            failed: acc.failed
          }
        }
        invalid = result
      }
      return {
        items: acc.items,
        expected: acc.expected.concat([invalid!.values.expected]),
        failed: true
      }
    }, { items: actual, expected: [], failed: false })

    const actualValues = actual.map((item) => {
      if (accumulatedResult.items.includes(item)) {
        return problem(item)
      } else {
        return item
      }
    })

    if (accumulatedResult.failed) {
      return new Invalid("The array failed to match.", {
        actual: actualValues,
        expected: accumulatedResult.expected
      })
    } else {
      return new Valid({
        actual: actualValues,
        expected: accumulatedResult.expected
      })
    }
  }
}

interface ArrayMatchMessage {
  index: number
  message: string
}

export interface ArrayContainingOptions {
  times?: number
}

export function isArrayContaining<T>(matcher: Matcher<T>, options: ArrayContainingOptions = {}): Matcher<Array<T>> {
  const expectedMatchCount = options.times

  return (actual) => {
    let validMatchValues, invalidMatchValues: MatchValues | undefined
    let matchedCount = 0
    for (const item of actual) {
      const matchResult = matcher(item)
      if (matchResult.type === "valid") {
        matchedCount++
        validMatchValues = matchResult.values
      } else {
        invalidMatchValues = matchResult.values
      }
    }

    let countMatcher: Matcher<number>
    if (expectedMatchCount === undefined) {
      countMatcher = isNumberGreaterThan(0)
    } else {
      countMatcher = equals(expectedMatchCount)
    }

    const countResult = countMatcher(matchedCount)

    if (countResult.type === "valid") {
      return new Valid({
        actual,
        expected: arrayContainsMessage(expectedMatchCount, validMatchValues)
      })
    } else {
      return new Invalid("The array does not contain what was expected.", {
        actual: problem(actual),
        expected: problem(arrayContainsMessage(expectedMatchCount, invalidMatchValues))
      })
    }
  }
}

function arrayContainsMessage(expectedMatchCount: number | undefined, matchValues: MatchValues | undefined): Description {
  return (expectedMatchCount === undefined)
    ? description("an array that contains %expected%", matchValues?.expected)
    : description(`an array that contains, ${timesMessage(expectedMatchCount)}, %expected%`, matchValues?.expected)
}