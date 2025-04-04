import { Invalid, Matcher, MatchResult, Valid } from "./matcher.js";
import { list, message, problem, value } from "./message.js";

export interface Constructor<T> extends Function {
  prototype: T;
}

export function objectOfType(constuctor: Constructor<any>): Matcher<any> {
  return (actual) => {
    const actualMessage = message`an object of type ${actual.constructor.name}`
    const expectedMessage = message`an object of type ${constuctor.name}`

    if (actual instanceof constuctor) {
      return new Valid({
        actual: actualMessage,
        expected: expectedMessage
      })
    } else {
      return new Invalid("", {
        actual: problem(actualMessage),
        expected: problem(expectedMessage)
      })
    }
  }
}

export function objectWithProperty<Obj extends { [key: PropertyKey]: any }, Key extends keyof Obj>(property: Key, matcher: Matcher<Obj[Key]>): Matcher<Obj> {
  return (actual) => {
    if (!Object.hasOwn(actual, property)) {
      return new Invalid("The object does not have the expected property.", {
        actual: problem(actual),
        expected: problem(message`an object with a property ${value(property)}`)
      })
    }

    const result = matcher(actual[property])

    const expectedMessage = message`an object with a property ${value(property)} that is ${result.values.expected}`

    switch (result.type) {
      case "valid":
        return new Valid({
          actual: value(objectWithValues(actual)),
          expected: expectedMessage
        })
      case "invalid":
        return new Invalid("The value at the specified property is unexpected.", {
          actual: value(objectWithInvalidProperty(property, actual)),
          expected: problem(expectedMessage)
        })
    }
  }
}

function objectWithValues<Obj extends Record<PropertyKey, any>>(actual: Obj) {
  const actualValues: any = {}
  let keys: Array<PropertyKey> = Object.getOwnPropertySymbols(actual)
  keys = keys.concat(Object.getOwnPropertyNames(actual))
  for (const key of keys) {
    actualValues[key] = value(actual[key])
  }
  return actualValues
}

function objectWithInvalidProperty<Obj extends Record<PropertyKey, any>, Key extends keyof Obj>(property: Key, actual: Obj) {
  const actualValues = objectWithValues(actual)
  return { ...actualValues, [property]: problem(actual[property]) }
}

export function objectWith<Obj extends { [key: PropertyKey]: any }, K extends Obj = Obj>(matchObject: { [key in keyof Partial<K>]: Matcher<K[key]> }): Matcher<Obj> {
  return (actual) => {
    const objectMatchResult = new ObjectMatchResult(actual as K, matchObject)

    if (objectMatchResult.hasMissingKeys()) {
      return missingKeyResult(objectMatchResult)
    }

    if (objectMatchResult.isValid()) {
      return validResult(objectMatchResult)
    } else {
      return invalidPropertyResult(objectMatchResult)
    }
  }
}

function validResult<Obj extends { [key: PropertyKey]: any }>(objectMatchResult: ObjectMatchResult<Obj>): MatchResult {
  return new Valid({
    actual: value(objectMatchResult.actualValues),
    expected: value(objectMatchResult.expectedValues)
  })
}

function invalidPropertyResult<Obj extends { [key: PropertyKey]: any }>(objectMatchResult: ObjectMatchResult<Obj>): MatchResult {
  const description = objectMatchResult.totalInvalidProperties() == 1
    ? "One of the object's properties was unexpected."
    : "Some of the object's properties were unexpected."
  return new Invalid(description, {
    actual: value(objectMatchResult.actualValues),
    expected: value(objectMatchResult.expectedValues)
  })
}

function missingKeyResult<Obj extends { [key: PropertyKey]: any }>(objectMatchResult: ObjectMatchResult<Obj>): MatchResult {
  const expectedKeys = objectMatchResult.getExpectedKeys().map((key) => {
    if (objectMatchResult.hasMissingKey(key)) {
      return problem(key)
    } else {
      return key
    }
  })

  return new Invalid(`The object does not have ${objectMatchResult.totalMissingKeys() == 1 ? "one" : "several"} of the expected properties.`, {
    actual: problem(objectMatchResult.actual),
    expected: message`an object that contains properties: ${list(expectedKeys)}`
  })
}

class ObjectMatchResult<Obj extends { [key: PropertyKey]: any }> {
  private expecteds: { [key: PropertyKey]: any } = {}
  private actuals: { [key: PropertyKey]: any } = {}
  missingKeys: Array<PropertyKey> = []
  invalidMatches: number = 0

  constructor(public actual: Obj, public matchObject: { [key in keyof Partial<Obj>]: Matcher<Obj[key]> }) {
    for (const matchKey in this.matchObject) {
      if (!Object.hasOwn(this.actual, matchKey)) {
        this.recordMissingKey(matchKey)
        continue
      }
      const result = this.matchObject[matchKey]!(this.actual[matchKey])
      this.recordResult(matchKey, result)
    }
  }

  get expectedValues() {
    return this.expecteds
  }

  get actualValues() {
    return {
      ...objectWithValues(this.actual),
      ...this.actuals
    }
  }

  isValid(): boolean {
    return this.invalidMatches == 0
  }

  totalInvalidProperties(): number {
    return this.invalidMatches
  }

  recordMissingKey(key: string) {
    this.missingKeys.push(key)
  }

  getExpectedKeys(): Array<PropertyKey> {
    return Object.getOwnPropertyNames(this.matchObject)
  }

  hasMissingKeys(): boolean {
    return this.missingKeys.length > 0
  }

  hasMissingKey(key: PropertyKey): boolean {
    return this.missingKeys.includes(key)
  }

  totalMissingKeys(): number {
    return this.missingKeys.length
  }

  recordResult(key: string, result: MatchResult) {
    if (result.type === "invalid") {
      this.invalidMatches += 1
    }
    this.actuals[key] = result.values.actual
    this.expecteds[key] = result.values.expected
  }
}
