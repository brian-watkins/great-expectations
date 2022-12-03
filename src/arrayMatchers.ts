import { Actual, actualValue, Expected, expectedMessage, expectedValue, Invalid, invalidActualValue, Matcher, Valid } from "./matcher"
import { matchCountMessage } from "./message"

export function isArrayWithLength<T>(expectedLength: number): Matcher<Array<T>> {
  return (actual) => {
    if (actual.length === expectedLength) {
      return new Valid()
    } else {
      return new Invalid(`The array length (${actual.length}) is unexpected.`, {
        actual: invalidActualValue(actual),
        expected: expectedMessage(`An array with length ${expectedLength}`)
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
    const lengthResult = isArrayWithLength(matchers.length)(actual)

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

interface UnorderedAccumulator<T> {
  items: Array<T>
  expected: Array<Expected>
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
            expected: acc.expected.concat([expectedValue(acc.items[x])]),
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
    }, {items: actual, expected: [], failed: false})

    if (accumulatedResult.failed) {
      const actualValues = actual.map((item) => {
        if (accumulatedResult.items.includes(item)) {
          return invalidActualValue(item)
        } else {
          return actualValue(item)
        }
      })
      return new Invalid("The array failed to match.", {
        actual: actualValue(actualValues),
        expected: expectedValue(accumulatedResult.expected)
      })
    }

    return new Valid()
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
  const expectedMatchCount = options.times ?? -1

  return (actual) => {
    let invalidMatch: Invalid | undefined
    let matchedCount = 0
    for (const item of actual) {
      const matchResult = matcher(item)
      switch (matchResult.type) {
        case "valid":
          matchedCount++
          break
        case "invalid":
          invalidMatch = matchResult
          break
      }
    }

    if (expectedMatchCount < 0 && matchedCount > 0) {
      return new Valid()
    }

    if (expectedMatchCount >= 0 && matchedCount == expectedMatchCount) {
      return new Valid()
    }

    let message = `An array containing`
    if (expectedMatchCount >= 0) {
      message += ` ${matchCountMessage(expectedMatchCount)}`
    }

    return new Invalid("The array does not contain what was expected.", {
      actual: invalidActualValue(actual),
      expected: expectedMessage(message, invalidMatch?.values.expected)
    })
  }
}
