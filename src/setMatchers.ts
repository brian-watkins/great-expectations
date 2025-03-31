import { matchWithoutOrder } from "./matchCollection";
import { Invalid, Matcher, Valid } from "./matcher";
import { message, problem, value } from "./message";
import { valueWhere } from "./valueMatchers";

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
