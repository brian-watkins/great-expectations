import { Invalid, Matcher, MatchResult, Valid } from "./matcher";
import { anyValue, Message, message, Problem, problem, Value, value } from "./message";

export interface MapEntryMatcher<K, V> {
  key: Matcher<K>
  value?: Matcher<V>
}

interface ExpectedMapEntry {
  key: Problem | Value | Message
  value: Problem | Value | Message
}

export function mapWith<K, V>(matchers: Array<MapEntryMatcher<K, V>>): Matcher<Map<K, V>> {
  return (actual) => {
    let expecteds: Array<ExpectedMapEntry> = []
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
        expecteds.push({
          key: lastKeyResult.values.expected,
          value: lastValueResult ? lastValueResult.values.expected : anyValue()
        })
        if (lastKeyResult.type === "invalid" || (lastValueResult && lastValueResult.type === "invalid")) {
          isValid = false
        }
      }
    }

    let expected
    if (expecteds.length > 0) {
      const map = new Map()
      for (const e of expecteds) {
        map.set(e.key, e.value)
      }
      expected = value(map)
    } else {
      isValid = false
      expected = message`a map with at least ${formatEntryCount(matchers.length)}`
    }

    if (isValid) {
      return new Valid({
        actual: value(actual),
        expected
      })
    } else {
      const message = expecteds.length === 0 ? "The map is empty." : "The map does not contain the expected entries."
      return new Invalid(message, {
        actual: problem(actual),
        expected
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