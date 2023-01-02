export interface TypeName {
  type: "type-name"
  value: any
}

export function typeName(value: any): TypeName {
  return {
    type: "type-name",
    value
  }
}

export interface Times {
  type: "times"
  count: number
}

export function times(count: number): Times {
  return {
    type: "times",
    count
  }
}

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

export interface Value {
  type: "value"
  value: any
}

export function value(val: any): Value {
  return {
    type: "value",
    value: val
  }
}

export interface Message {
  type: "message"
  strings: TemplateStringsArray
  values: Array<any>
}

export function message(strings: TemplateStringsArray, ...values: Array<any>): Message {
  return {
    type: "message",
    strings,
    values
  }
}