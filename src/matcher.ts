export class Valid {
  public type: "valid" = "valid"
}

export class Invalid<T> {
  public type: "invalid" = "invalid"
  
  constructor(public message: string, public values: MatchValues<T> = {}) {}
}

export interface MatchValues<T> {
  actual?: T
  expected?: T
}

export type MatchResult<T> = Valid | Invalid<T>

export type Matcher<T> = (actual: T) => MatchResult<T>
