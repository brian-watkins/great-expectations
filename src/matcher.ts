export interface MatchValues {
  actual: any
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

export interface Problem<T> {
  type: "problem"
  value: T
}

export function problem<T>(value: T): Problem<T> {
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

export interface List {
  type: "list"
  items: Array<any>
}

export function list(items: Array<any>): List {
  return {
    type: "list",
    items
  }
}