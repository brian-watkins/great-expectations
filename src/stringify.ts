import { ExpectedMessage, ExpectedValue } from "./matcher"

export function stringify(val: any): string {
  switch (typeof val) {
    case "boolean":
      return val === true ? "<TRUE>" : "<FALSE>"
    case "undefined":
      return "<UNDEFINED>"
    case "bigint":
      return val.toString()
    case "object":
      if (val === null) {
        return "<NULL>"
      } else if (Array.isArray(val)) {
        return `[ ${val.map(stringify).join(",\n  ")} ]`
      } else if (isExpectedValue(val)) {
        return stringify(val.value)
      } else if (isExpectedMessage(val)) {
        return val.message
      } else {
        return `{\n  ${Object.keys(val).map(key => `${key}: ${stringify(val[key])}`).join(",\n  ")}\n}`
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

function isExpectedValue(val: any): val is ExpectedValue {
  return ("type" in val && val.type === "expected-value")
}

function isExpectedMessage(val: any): val is ExpectedMessage {
  return ("type" in val && val.type === "expected-message")
}