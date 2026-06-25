import { Displayable } from "./message.js"

export interface MatchValues {
  actual: Displayable
  expected: Displayable
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
  readonly expects: Displayable
}

export function matcher<T>(expects: Displayable, evaluator: (actual: T) => MatchResult): Matcher<T> {
  return Object.assign(evaluator, { expects })
}