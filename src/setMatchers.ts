import { equalTo } from "./basicMatchers";
import { countMatches, matchWithoutOrder } from "./matchCollection";
import { Invalid, Matcher, MatchValues, Valid } from "./matcher";
import { Message, message, problem, times, value } from "./message";
import { isNumberGreaterThan } from "./numberMatchers";
import { valueWhere } from "./valueMatchers";

export function setWithSize<T>(expectedSize: number): Matcher<Set<T>> {
  return (actual) => {
    if (actual.size === expectedSize) {
      return new Valid({
        actual: value(actual),
        expected: message`a set with ${times(expectedSize, "element")}`
      })
    } else {
      return new Invalid(`The set size (${actual.size}) is unexpected.`, {
        actual: problem(actual),
        expected: problem(message`a set with ${times(expectedSize, "element")}`)
      })
    }
  }
}

export function setWith<T>(matchers: Array<Matcher<T>>): Matcher<Set<T>> {
  return (actual) => {
    const sizeResult = valueWhere<Set<any>>((actual) => actual.size === matchers.length, `a set of size ${matchers.length}`)(actual)

    if (sizeResult.type === "invalid") {
      return new Invalid(`The set size (${actual.size}) is unexpected.`, {
        actual: problem(new Set(Array.from(actual).map(value))),
        expected: problem(message`a set with size ${matchers.length}`)
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
  }
}

export interface SetContainingOptions {
  times?: number
}

export function setContaining<T>(matcher: Matcher<T>, options: SetContainingOptions = {}): Matcher<Set<T>> {
  const expectedMatchCount = options.times

  return (actual) => {
    if (actual.size === 0) {
      return new Invalid("The set does not contain the expected element.", {
        actual: problem(actual),
        expected: problem(message`a set that contains at least 1 element`)
      })
    }

    const results = countMatches(Array.from(actual), matcher)

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
        expected: problem(setContainsMessage(expectedMatchCount, results.lastInvalid))
      })
    } else {
      return new Valid({
        actual: value(actual),
        expected: setContainsMessage(expectedMatchCount, results.lastValid)
      })
    }
  }
}

function setContainsMessage(expectedMatchCount: number | undefined, matchValues: MatchValues | undefined): Message {
  return (expectedMatchCount === undefined)
    ? message`a set that contains ${matchValues?.expected}`
    : message`a set that contains, ${times(expectedMatchCount)}, ${matchValues?.expected}`
}