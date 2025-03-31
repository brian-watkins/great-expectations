import { Writer, noErrorWriter, noInfoWriter } from "./writer.js"
import { AnyValue, List, Message, Problem, SpecificValue, Times, TypeName } from "./message.js"

let visited: Array<any> = []

export function stringify(val: any, writer: Writer, indentLevel: number = 0): string {
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
        const arrayString = writeArray(val, writer, indentLevel)
        visited.pop()
        return arrayString
      } else if (val instanceof Map) {
        visited.push(val)
        const mapString = writeMap(val, writer, indentLevel)
        visited.pop()
        return mapString
      } else if (val instanceof Set) {
        visited.push(val)
        const setString = writeSet(val, writer, indentLevel)
        visited.pop()
        return setString
      } else if (val instanceof Error) {
        return val.toString()
      } else if (isTypeName(val)) {
        return writeTypeName(val.value)
      } else if (isTimes(val)) {
        return writeTimes(val.count)
      } else if (isSpecificValue(val)) {
        return stringify(val.value, writer, indentLevel)
      } else if (isAnyValue(val)) {
        return "<ANY>"
      } else if (isProblem(val)) {
        return writer.error(stringify(val.value, noErrorWriter(writer), indentLevel))
      } else if (isList(val)) {
        return writeList(val.items, writer, indentLevel)
      } else if (isMessage(val)) {
        return writer.info(writeMessage(val, writer, indentLevel))
      } else {
        visited.push(val)
        const objectString = writeObject(val, writer, indentLevel)
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

function writeMessage(message: Message, writer: Writer, indentLevel: number): string {
  let output = ""
  for (let i = 0; i < message.strings.length; i++) {
    output += message.strings[i]
    if (message.values.length > i) {
      const value = message.values[i]
      if (typeof value === "string") {
        output += value
        continue
      }
      output += stringify(message.values[i], noInfoWriter(writer), indentLevel)
    }
  }
  return output
}

function writeObject(val: any, writer: Writer, indentLevel: number): string {
  const keys = Object.keys(val)
  if (keys.length === 0) {
    return "{}"
  }

  return `{\n${keys.map(key => `${padding(indentLevel)}${key}: ${stringify(val[key], writer, indentLevel + 1)}`).join(",\n")}\n${padding(indentLevel - 1)}}`
}

function writeArray(items: Array<any>, writer: Writer, indentLevel: number): string {
  if (items.length === 0) {
    return '[]'
  }

  return `[\n${padding(indentLevel)}${items.map((val) => stringify(val, writer, indentLevel + 1)).join(`,\n${padding(indentLevel)}`)}\n${padding(indentLevel - 1)}]`
}

function writeSet(set: Set<any>, writer: Writer, indentLevel: number): string {
  if (set.size === 0) {
    return "Set ()"
  }

  const items = Array.from(set)
  return `Set (\n${padding(indentLevel)}${items.map((val) => stringify(val, writer, indentLevel + 1)).join(`,\n${padding(indentLevel)}`)}\n${padding(indentLevel - 1)})`
}

function writeMap(map: Map<any, any>, writer: Writer, indentLevel: number): string {
  if (map.size === 0) {
    return "Map {}"
  }

  const keys = Array.from(map.keys())

  return `Map {\n${keys.map(key => `${padding(indentLevel)}${stringify(key, writer, indentLevel + 1)} => ${stringify(map.get(key), writer, indentLevel + 1)}`).join(",\n")}\n${padding(indentLevel - 1)}}`
}

function writeList(items: Array<any>, writer: Writer, indentLevel: number): string {
  return `\n${padding(indentLevel)}• ${items.map((val) => stringify(val, writer, indentLevel + 1)).join(`\n${padding(indentLevel)}• `)}`
}

function padding(level: number): string {
  return "  ".repeat(level + 1)
}

function writeTypeName(value: any): string {
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

function writeTimes(count: number): string {
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