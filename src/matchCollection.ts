import { Invalid, Matcher, MatchValues } from "./matcher.js"

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

export interface MatchResults {
  matchCount: number
  lastValid: MatchValues | undefined
  lastInvalid: MatchValues | undefined
}

export function countMatches<T>(actual: Array<T>, matcher: Matcher<T>): MatchResults {
  const results: MatchResults = {
    matchCount: 0,
    lastValid: undefined,
    lastInvalid: undefined
  }
  for (const item of actual) {
    const matchResult = matcher(item)
    if (matchResult.type === "valid") {
      results.matchCount++
      results.lastValid = matchResult.values
    } else {
      results.lastInvalid = matchResult.values
    }
  }
  return results
}