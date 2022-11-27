export class Valid {
  public type: "valid" = "valid"
}

export class Invalid {
  public type: "invalid" = "invalid"
  
  constructor(public description: string, public values: MatchValues) {}
}

export interface ExpectedValue {
  type: "expected-value"
  value: any
}

export interface UnsatisfiedExpectedValue {
  type: "unsatisfied-expected-value"
  value: any
}

export interface ExpectedMessage {
  type: "expected-message"
  message: string
}

export type Expected = ExpectedValue | UnsatisfiedExpectedValue | ExpectedMessage

export function expectedValue(value: any): Expected {
  return {
    type: "expected-value",
    value
  }
}

export function unsatisfiedExpectedValue(value: any): Expected {
  return {
    type: "unsatisfied-expected-value",
    value
  }
}

export function expectedMessage(message: string): Expected {
  return {
    type: "expected-message",
    message: `<${message}>`
  }
}

export interface ActualValue {
  type: "actual-value"
  value: any
}

export interface InvalidActualValue {
  type: "invalid-actual-value"
  value: any
}

export type Actual = ActualValue | InvalidActualValue

export function actualValue(value: any): Actual {
  return {
    type: "actual-value",
    value
  }
}

export function invalidActualValue(value: any): Actual {
  return {
    type: "invalid-actual-value",
    value
  }
}

export interface MatchValues {
  actual: Actual
  expected: Expected
}

export type MatchResult = Valid | Invalid

export type Matcher<T> = (actual: T) => MatchResult
