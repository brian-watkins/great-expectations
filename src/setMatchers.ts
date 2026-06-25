import { equalTo } from "./basicMatchers.js";
import { countMatches, matchWithoutOrder } from "./matchCollection.js";
import { Invalid, matcher, Matcher, Valid } from "./matcher.js";
import { Message, message, Problem, problem, times, Value, value } from "./message.js";
import { isNumberGreaterThan } from "./numberMatchers.js";
import { valueWhere } from "./valueMatchers.js";

export function setWithSize<T>(expectedSize: number): Matcher<Set<T>> {
  const description = message`a set with ${times(expectedSize, "element")}`
  
  return matcher(description, (actual) => {
    if (actual.size === expectedSize) {
      return new Valid({
        actual: value(actual),
        expected: description
      })
    } else {
      return new Invalid(`The set size (${actual.size}) is unexpected.`, {
        actual: problem(actual),
        expected: problem(description)
      })
    }
  })
}

export function setWith<T>(matchers: Array<Matcher<T>>): Matcher<Set<T>> {
  const description = value(new Set(matchers.map(m => m.expects)))
  
  return matcher(description, (actual) => {
    const sizeResult = valueWhere<Set<any>>((actual) => actual.size === matchers.length, `a set of size ${matchers.length}`)(actual)

    if (sizeResult.type === "invalid") {
      return new Invalid(`The set size (${actual.size}) is unexpected.`, {
        actual: problem(new Set(Array.from(actual).map(value))),
        expected: problem(description)
      })
    }

    const items = Array.from(actual)

    const results = matchWithoutOrder(items, matchers)

    const actualValues = items.map((item) => {
      if (results.items.includes(item)) {
        return problem(item)
      } else {
        return value(item)
      }
    })

    if (results.failed) {
      return new Invalid("The set failed to match.", {
        actual: value(new Set(actualValues)),
        expected: value(new Set(results.expected))
      })
    } else {
      return new Valid({
        actual: value(new Set(actualValues)),
        expected: value(new Set(results.expected))
      })
    }
  })
}

export interface SetContainingOptions {
  times?: number
}

export function setContaining<T>(elementMatcher: Matcher<T>, options: SetContainingOptions = {}): Matcher<Set<T>> {
  const expectedMatchCount = options.times
  const description = setContainsMessage(expectedMatchCount, elementMatcher.expects)

  return matcher(description, (actual) => {
    if (actual.size === 0) {
      return new Invalid("The set does not contain the expected element.", {
        actual: problem(actual),
        expected: problem(description)
      })
    }

    const results = countMatches(Array.from(actual), elementMatcher)

    let countMatcher: Matcher<number>
    if (expectedMatchCount === undefined) {
      countMatcher = isNumberGreaterThan(0)
    } else {
      countMatcher = equalTo(expectedMatchCount)
    }

    const countResult = countMatcher(results.matchCount)

    if (countResult.type === "invalid") {
      return new Invalid("The set does not contain the expected element.", {
        actual: problem(actual),
        expected: problem(setContainsMessage(expectedMatchCount, results.lastInvalid?.expected))
      })
    } else {
      return new Valid({
        actual: value(actual),
        expected: setContainsMessage(expectedMatchCount, results.lastValid?.expected)
      })
    }
  })
}

function setContainsMessage(expectedMatchCount: number | undefined, expected: Problem | Value | Message | undefined): Message {
  return (expectedMatchCount === undefined)
    ? message`a set that contains ${expected}`
    : message`a set that contains, ${times(expectedMatchCount)}, ${expected}`
}