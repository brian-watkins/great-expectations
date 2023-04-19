import { Invalid, Matcher, MatchResult, Valid } from "./matcher.js";
import { anyValue, Message, message, Problem, problem, Value, value } from "./message.js";

export interface MapEntryMatcher<K, V> {
  key: Matcher<K>
  value?: Matcher<V>
}

export function mapContaining<K, V>(matcher: MapEntryMatcher<K, V>): Matcher<Map<K, V>> {
  return (actual) => {
    if (actual.size === 0) {
      return new Invalid("The map does not contain the expected entry.", {
        actual: problem(actual),
        expected: problem(message`a map with at least 1 entry`)
      })
    }

    let expectedKey
    let expectedValue: Value | Problem | Message = anyValue()
    let isValid = false
    for (const key of actual.keys()) {
      const keyResult = matcher.key(key)
      expectedKey = keyResult.values.expected
      if (keyResult.type === "valid") {
        if (matcher.value) {
          const valueResult = matcher.value(actual.get(key)!)
          expectedValue = valueResult.values.expected
          if (valueResult.type === "valid") {
            isValid = true
            break
          }
        } else {
          isValid = true
        }
        break
      }
    }

    if (isValid) {
      return new Valid({
        actual: value(actual),
        expected: message`a map that contains the entry { ${expectedKey} => ${expectedValue} }`
      })
    } else {
      return new Invalid("The map does not contain the expected entry.", {
        actual: problem(actual),
        expected: message`a map that contains the entry { ${expectedKey} => ${expectedValue} }`
      })
    }

  }
}

interface ExpectedMapEntry {
  key: Problem | Value | Message
  value: Problem | Value | Message
}

export function mapWith<K, V>(matchers: Array<MapEntryMatcher<K, V>>): Matcher<Map<K, V>> {
  return (actual) => {
    let expecteds: Array<ExpectedMapEntry> = []
    let invalidCount = 0

    let actualKeys = new Set(actual.keys())

    for (const entryMatcher of matchers) {
      let lastKeyResult: MatchResult | null = null
      let lastValueResult: MatchResult | null = null
      for (const key of actualKeys) {
        lastKeyResult = entryMatcher.key(key)
        if (lastKeyResult.type === "valid") {
          if (entryMatcher.value) {
            lastValueResult = entryMatcher.value(actual.get(key)!)
          }
          actualKeys.delete(key)
          break
        }
      }
      if (lastKeyResult) {
        expecteds.push({
          key: lastKeyResult.values.expected,
          value: lastValueResult ? lastValueResult.values.expected : anyValue()
        })
        if (lastKeyResult.type === "invalid" || (lastValueResult && lastValueResult.type === "invalid")) {
          invalidCount = invalidCount + 1
        }
      }
    }

    let expected
    if (actualKeys.size - invalidCount > 0) {
      invalidCount = 1
      expected = problem(message`a map with only ${formatEntryCount(matchers.length)}`)
    } else if (expecteds.length > 0 && expecteds.length !== matchers.length) {
      invalidCount = 1
      expected = problem(message`a map with ${formatEntryCount(matchers.length)}`)
    } else if (expecteds.length === 0 && matchers.length > 0) {
      invalidCount = 1
      expected = problem(message`a map with ${formatEntryCount(matchers.length)}`)
    } else {
      const map = new Map()
      for (const e of expecteds) {
        map.set(e.key, e.value)
      }
      expected = value(map)
    }

    if (invalidCount === 0) {
      return new Valid({
        actual: value(actual),
        expected
      })
    } else {
      const message = expecteds.length === 0 ? "The map is empty." : "The map does not match the expected entries."
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