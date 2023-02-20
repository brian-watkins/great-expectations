import { Message, Problem, Value } from "./message.js"

export interface MatchValues {
  actual: Problem | Value | Message
  expected: Problem | Value | Message
}

export class Valid {
  public type: "valid" = "valid"

  constructor(public values: MatchValues) {}
}

export class Invalid {
  public type: "invalid" = "invalid"
  
  constructor(public description: string, public values: MatchValues) {}
}

export type MatchResult = Valid | Invalid

export type Matcher<T> = (actual: T) => MatchResult
