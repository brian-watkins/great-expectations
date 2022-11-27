import { effect, example, ExampleScriptsBuilder, Observation } from "esbehavior";
import { strict as assert } from "node:assert"
import { Expected, expectedMessage, expectedValue, Invalid, MatchResult, Valid } from "../src/matcher";

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


export function assertIsValidMatch<T>(result: MatchResult<T>): result is Valid {
  assert(result instanceof Valid, "The result should be Valid")
  return true
}

export function assertIsInvalidMatch<T>(result: MatchResult<T>): result is Invalid<T> {
  assert(result instanceof Invalid, "The result should be Invalid")
  return true
}

export function assertHasMessage<T>(expectedMessage: string, result: MatchResult<T>) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.description, expectedMessage)
  }
}

export function assertHasActualValue<T>(expectedActualValue: T, result: MatchResult<T>) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.values.actual, expectedActualValue)
  }
}

export function assertHasExpected<T>(expectedValue: Expected, result: MatchResult<T>) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.values.expected, expectedValue)
  }
}

export function isValidMatchResult<T>(): Property<MatchResult<T>> {
  return property("the match result is valid", (result) => {
    assertIsValidMatch(result)
  })
}

export function isInvalidMatchResult<T>(): Property<MatchResult<T>> {
  return property("the match result is invalid", (result) => {
    assertIsInvalidMatch(result)
  })
}

export function hasMessage<T>(message: string): Property<MatchResult<T>> {
  return property("the message explains what happened", (result) => {
    assertHasMessage(message, result)
  })
}

export function hasExpectedValue<T>(value: any): Property<MatchResult<T>> {
  return property("the expected value is shown", (result) => {
    assertHasExpected(expectedValue(value), result)
  })
}

export function hasExpectedMessage<T>(message: string): Property<MatchResult<T>> {
  return property("a message explaining the expectation is shown", (result) => {
    assertHasExpected(expectedMessage(message), result)
  })
}

export function hasActual<T>(value: T): Property<MatchResult<T>> {
  return property("the actual value is shown", (result) => {
    assertHasActualValue(value, result)
  })
}
