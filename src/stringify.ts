import { ANSIFormatter, Formatter } from "./formatter"
import { ActualValue, Expected, Description, ExpectedValue, InvalidActualValue, UnsatisfiedExpectedValue } from "./matcher"

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
        return `[ ${val.map(stringifyWithFormatter).join("\n, ")}\n]`
      } else if (isExpectedValue(val)) {
        return stringify(val.value, formatter)
      } else if (isUnsatisfiedExpectedValue(val)) {
        return formatter.green(stringify(val.value, formatter))
      } else if (isDescription(val)) {
        if (val.next.length > 0) {
          const message = replaceMessage(formatter, val.message, val.next)
          return formatter.info(message)
        } else {
          return formatter.info(val.message)
        }
      } else if (isActualValue(val)) {
        return stringify(val.value, formatter)
      } else if (isInvalidActualValue(val)) {
        return formatter.red(stringify(val.value, formatter))
      } else {
        return `{\n  ${Object.keys(val).map(key => `${key}: ${stringify(val[key], formatter)}`).join(",\n  ")}\n}`
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

function replaceMessage(formatter: Formatter, text: string, expecteds: Array<Expected | Description>): string {
  if (expecteds.length == 0) {
    return text
  }

  const [first, ...rest] = expecteds
  const replaced = text.replace("%expected%", stringify(first, noInfoFormatter(formatter)))

  return replaceMessage(formatter, replaced, rest)
}

function noInfoFormatter(formatter: Formatter): Formatter {
  return {
    ...formatter,
    info: (message) => message,
  }
}

function isExpectedValue(val: any): val is ExpectedValue {
  return ("type" in val && val.type === "expected-value")
}

function isUnsatisfiedExpectedValue(val: any): val is UnsatisfiedExpectedValue {
  return ("type" in val && val.type === "unsatisfied-expected-value")
}

function isDescription(val: any): val is Description {
  return ("type" in val && val.type === "description")
}

function isActualValue(val: any): val is ActualValue {
  return ("type" in val && val.type === "actual-value")
}

function isInvalidActualValue(val: any): val is InvalidActualValue {
  return ("type" in val && val.type === "invalid-actual-value")
}
