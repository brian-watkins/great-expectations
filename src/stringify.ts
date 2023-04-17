import { Formatter, noErrorFormatter, noInfoFormatter } from "./formatter.js"
import { AnyValue, List, Message, Problem, SpecificValue, Times, TypeName } from "./message.js"

let visited: Array<any> = []

export function stringify(val: any, formatter: Formatter, indentLevel: number = 0): string {
  switch (typeof val) {
    case "boolean":
      return val === true ? "<TRUE>" : "<FALSE>"
    case "undefined":
      return "<UNDEFINED>"
    case "bigint":
      return val.toString()
    case "object":
      if (visited.indexOf(val) !== -1) {
        return "<CIRCULAR>"
      } else if (val === null) {
        return "<NULL>"
      } else if (Array.isArray(val)) {
        visited.push(val)
        const arrayString = formatArray(val, formatter, indentLevel)
        visited.pop()
        return arrayString
      } else if (val instanceof Map) {
        // need to handle circular reference
        visited.push(val)
        const mapString = formatMap(val, formatter, indentLevel)
        visited.pop()
        return mapString
      } else if (isTypeName(val)) {
        return formatTypeName(val.value)
      } else if (isTimes(val)) {
        return formatTimes(val.count)
      } else if (isSpecificValue(val)) {
        return stringify(val.value, formatter, indentLevel)
      } else if (isAnyValue(val)) {
        return "<ANY>"
      } else if (isProblem(val)) {
        return formatter.error(stringify(val.value, noErrorFormatter(formatter), indentLevel))
      } else if (isList(val)) {
        return formatList(val.items, formatter, indentLevel)
      } else if (isMessage(val)) {
        return formatter.info(formatMessage(val, formatter, indentLevel))
      } else {
        visited.push(val)
        const objectString = formatObject(val, formatter, indentLevel)
        visited.pop()
        return objectString
      }
    case "function":
      return "<FUNCTION>"
    case "symbol":
      return `<SYMBOL(${val.description ?? ""})>`
    case "string":
      return `\"${val}\"`
    case "number":
      return `${val}`
  }
}

function formatMessage(message: Message, formatter: Formatter, indentLevel: number): string {
  let output = ""
  for (let i = 0; i < message.strings.length; i++) {
    output += message.strings[i]
    if (message.values.length > i) {
      const value = message.values[i]
      if (typeof value === "string") {
        output += value
        continue
      }
      output += stringify(message.values[i], noInfoFormatter(formatter), indentLevel)
    }
  }
  return output
}

function formatObject(val: any, formatter: Formatter, indentLevel: number): string {
  const keys = Object.keys(val)
  if (keys.length === 0) {
    return "{}"
  }

  return `{\n${keys.map(key => `${padding(indentLevel)}${key}: ${stringify(val[key], formatter, indentLevel + 1)}`).join(",\n")}\n${padding(indentLevel - 1)}}`
}

function formatArray(items: Array<any>, formatter: Formatter, indentLevel: number): string {
  if (items.length === 0) {
    return '[]'
  }

  return `[\n${padding(indentLevel)}${items.map((val) => stringify(val, formatter, indentLevel + 1)).join(`,\n${padding(indentLevel)}`)}\n${padding(indentLevel - 1)}]`
}

function formatMap(map: Map<any, any>, formatter: Formatter, indentLevel: number): string {
  if (map.size === 0) {
    return "Map {}"
  }

  const keys = Array.from(map.keys())

  return `Map {\n${keys.map(key => `${padding(indentLevel)}${stringify(key, formatter, indentLevel + 1)} => ${stringify(map.get(key), formatter, indentLevel + 1)}`).join(",\n")}\n${padding(indentLevel - 1)}}`
}

function formatList(items: Array<any>, formatter: Formatter, indentLevel: number): string {
  return `\n${padding(indentLevel)}• ${items.map((val) => stringify(val, formatter, indentLevel + 1)).join(`\n${padding(indentLevel)}• `)}`
}

function padding(level: number): string {
  return "  ".repeat(level + 1)
}

function formatTypeName(value: any): string {
  switch (typeof (value)) {
    case "boolean":
      return "a boolean"
    case "object":
      if (Array.isArray(value)) {
        return "an array"
      } else {
        return "an object"
      }
    case "number":
      return "a number"
    case "string":
      return "a string"
    case "symbol":
      return "a symbol"
    case "function":
      return "a function"
    case "bigint":
      return "a bigint"
    case "undefined":
      return "undefined"
  }
}

function formatTimes(count: number): string {
  if (count === 1) {
    return "exactly 1 time"
  } else {
    return `exactly ${count} times`
  }
}

function isProblem(val: any): val is Problem {
  return ("type" in val && val.type === "problem")
}

function isList(val: any): val is List {
  return ("type" in val && val.type === "list")
}

function isSpecificValue(val: any): val is SpecificValue {
  return ("type" in val && val.type === "specific-value")
}

function isAnyValue(val: any): val is AnyValue {
  return ("type" in val && val.type === "any-value")
}

function isTypeName(val: any): val is TypeName {
  return ("type" in val && val.type === "type-name")
}

function isTimes(val: any): val is Times {
  return ("type" in val && val.type === "times")
}

function isMessage(val: any): val is Message {
  return ("type" in val && val.type === "message")
}