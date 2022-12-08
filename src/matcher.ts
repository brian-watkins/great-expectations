export interface MatchValues {
  actual: any
  operator: string
  argument: any
  expected: any
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

export interface Problem {
  type: "problem"
  value: any
}

export function problem(value: any): Problem {
  return {
    type: "problem",
    value
  }
}

export interface Description {
  type: "description"
  message: string
  next: Array<any>
}

export function description(message: string, ...next: Array<any | undefined>): Description {
  return {
    type: "description",
    message: `${message}`,
    next: next.filter(val => val !== undefined) as Array<any>
  }
}
