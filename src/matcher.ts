import { MatchDescription } from "./message.js"

export interface MatchValues {
  actual: MatchDescription
  expected: MatchDescription
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

export interface Matcher<T> {
  (actual: T): MatchResult
  readonly expects: MatchDescription
}

export function matcher<T>(expects: MatchDescription, evaluator: (actual: T) => MatchResult): Matcher<T> {
  return Object.assign(evaluator, { expects })
}