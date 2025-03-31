import { Invalid, Matcher } from "./matcher.js"

interface MatchCollection<T> {
  items: Array<T>
  expected: Array<any>
  failed: boolean
}

export function matchWithoutOrder<T>(actual: Array<T>, matchers: Array<Matcher<T>>): MatchCollection<T> {
  return matchers.reduce((acc: MatchCollection<T>, matcher: Matcher<T>) => {
    let invalid: Invalid
    for (let x = 0; x < acc.items.length; x++) {
      const result = matcher(acc.items[x])
      if (result.type === "valid") {
        return {
          items: acc.items.toSpliced(x, 1),
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
}
