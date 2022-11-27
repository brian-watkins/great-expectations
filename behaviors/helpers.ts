import { effect, example, ExampleScriptsBuilder, Observation } from "esbehavior";
import { strict as assert } from "node:assert"
import { Actual, actualValue, Expected, expectedMessage, expectedValue, Invalid, invalidActualValue, MatchResult, Valid } from "../src/matcher";

type Property<T> = Observation<T>

export function property<T>(description: string, claim: (result: T) => void): Property<T> {
  return effect(description, claim)
}

interface UseCaseBuilder<T> {
  check(properties: Array<Property<T>>): ExampleScriptsBuilder<T>
}

export function exhibit<T>(description: string, runner: () => T): UseCaseBuilder<T> {
  return {
    check: (properties) => {
      return example({ init: runner })
        .description(description)
        .script({
          observe: properties
        })
    }
  }
}


export function assertIsValidMatch(result: MatchResult): result is Valid {
  assert(result instanceof Valid, "The result should be Valid")
  return true
}

export function assertIsInvalidMatch(result: MatchResult): result is Invalid {
  assert(result instanceof Invalid, "The result should be Invalid")
  return true
}

export function assertHasMessage(expectedMessage: string, result: MatchResult) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.description, expectedMessage)
  }
}

export function assertHasActual(expectedActual: Actual, result: MatchResult) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.values.actual, expectedActual)
  }
}

export function assertHasExpected(expectedValue: Expected, result: MatchResult) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.values.expected, expectedValue)
  }
}

export function isValidMatchResult(): Property<MatchResult> {
  return property("the match result is valid", (result) => {
    assertIsValidMatch(result)
  })
}

export function isInvalidMatchResult(): Property<MatchResult> {
  return property("the match result is invalid", (result) => {
    assertIsInvalidMatch(result)
  })
}

export function hasMessage(message: string): Property<MatchResult> {
  return property("the message explains what happened", (result) => {
    assertHasMessage(message, result)
  })
}

export function hasExpectedValue(value: any): Property<MatchResult> {
  return property("the expected value is shown", (result) => {
    assertHasExpected(expectedValue(value), result)
  })
}

export function hasExpectedMessage(message: string): Property<MatchResult> {
  return property("a message explaining the expectation is shown", (result) => {
    assertHasExpected(expectedMessage(message), result)
  })
}

export function hasActual<T>(value: T): Property<MatchResult> {
  return property("the actual value is shown", (result) => {
    assertHasActual(actualValue(value), result)
  })
}

export function hasInvalidActual<T>(value: T): Property<MatchResult> {
  return property("the actual value is shown as invalid", (result) => {
    assertHasActual(invalidActualValue(value), result)
  })
}
