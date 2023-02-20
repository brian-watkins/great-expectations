import { effect, example, ExampleScriptsBuilder, Observation } from "esbehavior";
import { strict as assert } from "node:assert"
import { Formatter } from "../src/formatter.js";
import { Invalid, MatchResult, Valid } from "../src/matcher.js";
import { problem, Problem, value } from "../src/message.js";
import { stringify } from "../src/stringify.js";

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
  assert(result instanceof Valid, `The result should be Valid\n\n${JSON.stringify(result)}`)
  return true
}

export function assertIsInvalidMatch(result: MatchResult): result is Invalid {
  assert(result instanceof Invalid, `The result should be Invalid\n\n${JSON.stringify(result)}`)
  return true
}

export function assertHasMessage(expectedMessage: string, result: MatchResult) {
  if (assertIsInvalidMatch(result)) {
    assert.deepEqual(result.description, expectedMessage)
  }
}

export function assertHasActual<T>(expectedActual: T | Problem, result: MatchResult) {
  assert.deepEqual(result.values.actual, expectedActual)
}

export function assertHasActualMessage(expectedMessage: string, result: MatchResult) {
  assert.deepEqual(stringify(result.values.actual, testFormatter), expectedMessage)
}

export function assertHasExpectedMessage(expectedMessage: string, result: MatchResult) {
  assert.deepEqual(stringify(result.values.expected, testFormatter), expectedMessage)
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

export function hasExpectedMessageText(message: string): Property<MatchResult> {
  return property("a message explaining the expectation is shown", (result) => {
    assertHasExpectedMessage(message, result)
  })
}

export function hasExpected(value: any): Property<MatchResult> {
  return property("a message explaining the expectation is shown", (result) => {
    assert.deepEqual(stringify(result.values.expected, testFormatter), stringify(value, testFormatter))
  })
}

export function hasActual<T>(actual: T): Property<MatchResult> {
  return property("the actual value is shown", (result) => {
    assertHasActual(value(actual), result)
  })
}

export function hasInvalidActual<T>(value: T): Property<MatchResult> {
  return property("the actual value is shown as invalid", (result) => {
    assertHasActual(problem(value), result)
  })
}

export function formattedList(items: Array<string>): string {
  return `\n  • ${items.join("\n  • ")}`
}

export const testFormatter: Formatter = {
  info: (message) => `info(${message})`,
  error: (message) => `error(${message})`,
}