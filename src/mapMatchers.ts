import { Invalid, Matcher, MatchResult, Valid } from "./matcher";
import { list, message, problem, value } from "./message";

export interface MapEntryMatcher<K, V> {
  key: Matcher<K>
  value?: Matcher<V>
}

export function mapWith<K, V>(matchers: Array<MapEntryMatcher<K, V>>): Matcher<Map<K, V>> {
  return (actual) => {
    let expecteds = []
    let isValid = true
    for (const entryMatcher of matchers) {
      let lastKeyResult: MatchResult | null = null
      let lastValueResult: MatchResult | null = null
      for (const key of actual.keys()) {
        lastKeyResult = entryMatcher.key(key)
        if (lastKeyResult.type === "valid") {
          if (entryMatcher.value) {
            lastValueResult = entryMatcher.value(actual.get(key)!)
          }
          break
        }
      }
      if (lastKeyResult) {
        expecteds.push(message`${lastKeyResult.values.expected} => ${lastValueResult ? lastValueResult.values.expected : "anything"}`)
        if (lastKeyResult.type === "invalid" || (lastValueResult && lastValueResult.type === "invalid")) {
          isValid = false
        }
      }
    }

    let expectedMessage
    if (expecteds.length > 0) {
      expectedMessage = message`a map with entries: ${list(expecteds)}`
    } else {
      isValid = false
      expectedMessage = message`a map with at least ${formatEntryCount(matchers.length)}`
    }
    

    if (isValid) {
      return new Valid({
        actual: value(actual),
        expected: expectedMessage
      })
    } else {
      const message = expecteds.length === 0 ? "The map is empty." : "The map does not contain all the expected entries."
      return new Invalid(message, {
        actual: problem(actual),
        expected: expectedMessage
      })
    }
  }
}

function formatEntryCount(count: number): string {
  if (count === 1) {
    return "1 entry"
  } else {
    return `${count} entries`
  }
}