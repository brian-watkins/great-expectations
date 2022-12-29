import { description, Invalid, list, Matcher, MatchResult, problem, Valid } from "./matcher";

export function objectWithProperty<T>(property: PropertyKey, matcher: Matcher<T>): Matcher<any> {
  return (actual) => {
    if (!Object.hasOwn(actual, property)) {
      return new Invalid("The object does not have the expected property.", {
        actual: problem(actual),
        expected: problem(description("an object with a property %expected%", property))
      })
    }

    const result = matcher(actual[property])

    const message = description("an object with a property %expected% that is %expected%", property, result.values.expected)

    switch (result.type) {
      case "valid":
        return new Valid({
          actual,
          expected: message
        })
      case "invalid":
        return new Invalid("The value at the specified property is unexpected.", {
          actual: problem(actual),
          expected: problem(message)
        })
    }
  }
}

export function objectWhere(matchObject: { [key: PropertyKey]: Matcher<any> }): Matcher<{ [key: PropertyKey]: any }> {
  return (actual) => {
    const objectMatchResult = new ObjectMatchResult(actual, matchObject)

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

function validResult(objectMatchResult: ObjectMatchResult): MatchResult {
  return new Valid({
    actual: objectMatchResult.actuals,
    expected: objectMatchResult.expecteds
  })
}

function invalidPropertyResult(objectMatchResult: ObjectMatchResult): MatchResult {
  const message = objectMatchResult.totalInvalidProperties() == 1
    ? "One of the object's properties was unexpected."
    : "Some of the object's properties were unexpected."
  return new Invalid(message, {
    actual: objectMatchResult.actuals,
    expected: objectMatchResult.expecteds
  })
}

function missingKeyResult(objectMatchResult: ObjectMatchResult): MatchResult {
  const expectedKeys = objectMatchResult.getExpectedKeys().map((key) => {
    if (objectMatchResult.hasMissingKey(key)) {
      return problem(key)
    } else {
      return key
    }
  })

  return new Invalid(`The object does not have ${objectMatchResult.totalMissingKeys() == 1 ? "one" : "several"} of the expected properties.`, {
    actual: problem(objectMatchResult.actual),
    expected: description("an object that contains properties: %expected%", list(expectedKeys))
  })
}

class ObjectMatchResult {
  expecteds: { [key: PropertyKey]: any } = {}
  actuals: { [key: PropertyKey]: any } = {}
  missingKeys: Array<PropertyKey> = []
  invalidMatches: number = 0

  constructor(public actual: { [key: PropertyKey]: any }, public matchObject: { [key: PropertyKey]: Matcher<any> }) {
    for (const matchKey in this.matchObject) {
      if (!Object.hasOwn(this.actual, matchKey)) {
        this.recordMissingKey(matchKey)
        continue
      }
      const result = this.matchObject[matchKey](this.actual[matchKey])
      this.recordResult(matchKey, result)
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
