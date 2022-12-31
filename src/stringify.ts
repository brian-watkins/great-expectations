import { Formatter, noErrorFormatter, noInfoFormatter } from "./formatter"
import { List, Message, Problem, TypeName, Value } from "./message"

let visited: Array<any> = []

export function stringify(val: any, formatter: Formatter): string {
  const stringifyWithFormatter = (val: any) => stringify(val, formatter)

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
        const arrayString = `[\n  ${val.map(stringifyWithFormatter).join(",\n  ")},\n]`
        visited.pop()
        return arrayString
      } else if (isTypeName(val)) {
        return formatTypeName(val.value)
      } else if (isValue(val)) {
        return stringifyWithFormatter(val.value)
      } else if (isProblem(val)) {
        return formatter.error(stringify(val.value, noErrorFormatter(formatter)))
      } else if (isList(val)) {
        return `\n  • ${val.items.map(stringifyWithFormatter).join("\n  • ")}`
      } else if (isMessage(val)) {
        return formatter.info(formatMessage(val, formatter))
      } else {
        visited.push(val)
        const objectString = `{ ${Object.keys(val).map(key => `${key}: ${stringifyWithFormatter(val[key])}`).join(", ")} }`
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

function formatMessage(message: Message, formatter: Formatter): string {
  let output = ""
  for (let i = 0; i < message.strings.length; i++) {
    output += message.strings[i]
    if (message.values.length > i) {
      const value = message.values[i]
      if (typeof value === "string") {
        output += value
        continue
      }
      output += stringify(message.values[i], noInfoFormatter(formatter))
    }
  }
  return output
}

function formatTypeName(value: any): string {
  switch (typeof (value)) {
    case "boolean":
      return "a boolean"
    case "object":
      return "an object"
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

function isProblem<T>(val: any): val is Problem<T> {
  return ("type" in val && val.type === "problem")
}

function isList(val: any): val is List {
  return ("type" in val && val.type === "list")
}

function isValue(val: any): val is Value {
  return ("type" in val && val.type === "value")
}

function isTypeName(val: any): val is TypeName {
  return ("type" in val && val.type === "type-name")
}

function isMessage(val: any): val is Message {
  return ("type" in val && val.type === "message")
}