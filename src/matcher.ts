export class Valid {
  public type: "valid" = "valid"
}

export class Invalid<T> {
  public type: "invalid" = "invalid"
  
  constructor(public description: string, public values: MatchValues<T>) {}
}

export interface ExpectedValue {
  type: "expected-value"
  value: any
}

export interface ExpectedMessage {
  type: "expected-message"
  message: string
}

export type Expected = ExpectedValue | ExpectedMessage

export function expectedValue(value: any): Expected {
  return {
    type: "expected-value",
    value
  }
}

export function expectedMessage(message: string): Expected {
  return {
    type: "expected-message",
    message: `<${message}>`
  }
}

export interface MatchValues<T> {
  actual: T
  expected: Expected
}

export type MatchResult<T> = Valid | Invalid<T>

export type Matcher<T> = (actual: T) => MatchResult<T>
