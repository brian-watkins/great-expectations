import { ANSIFormatter, Formatter } from "./formatter"
import { ActualValue, ExpectedMessage, ExpectedValue, InvalidActualValue, UnsatisfiedExpectedValue } from "./matcher"

export function stringify(val: any, formatter: Formatter = ANSIFormatter): string {
  const stringifyWithFormatter = (val: any) => stringify(val, formatter)

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
        return `[ ${val.map(stringifyWithFormatter).join(",\n  ")} ]`
      } else if (isExpectedValue(val)) {
        return stringify(val.value)
      } else if (isUnsatisfiedExpectedValue(val)) {
        return formatter.green(stringify(val.value))
      } else if (isExpectedMessage(val)) {
        return formatter.green(val.message)
      } else if (isActualValue(val)) {
        return stringify(val.value)
      } else if (isInvalidActualValue(val)) {
        return formatter.red(stringify(val.value))
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

function isUnsatisfiedExpectedValue(val: any): val is UnsatisfiedExpectedValue {
  return ("type" in val && val.type === "unsatisfied-expected-value")
}

function isExpectedMessage(val: any): val is ExpectedMessage {
  return ("type" in val && val.type === "expected-message")
}

function isActualValue(val: any): val is ActualValue {
  return ("type" in val && val.type === "actual-value")
}

function isInvalidActualValue(val: any): val is InvalidActualValue {
  return ("type" in val && val.type === "invalid-actual-value")
}
