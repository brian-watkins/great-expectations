import { Formatter, noErrorFormatter, noInfoFormatter } from "./formatter"
import { Description, Problem } from "./matcher"

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
      if (val === null) {
        return "<NULL>"
      } else if (Array.isArray(val)) {
        return `[ ${val.map(stringifyWithFormatter).join("\n, ")}\n]`
      } else if (isProblem(val)) {
        return formatter.error(stringify(val.value, noErrorFormatter(formatter)))
      } else if (isDescription(val)) {
        if (val.next.length > 0) {
          const message = replaceMessage(formatter, val.message, val.next)
          return formatter.info(message)
        } else {
          return formatter.info(val.message)
        }
      } else {
        return `{ ${Object.keys(val).map(key => `${key}: ${stringify(val[key], formatter)}`).join(", ")} }`
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

function replaceMessage(formatter: Formatter, text: string, expecteds: Array<any>): string {
  if (expecteds.length == 0) {
    return text
  }

  const [first, ...rest] = expecteds
  const replaced = text.replace("%expected%", stringify(first, noInfoFormatter(formatter)))

  return replaceMessage(formatter, replaced, rest)
}

function isDescription(val: any): val is Description {
  return ("type" in val && val.type === "description")
}

function isProblem<T>(val: any): val is Problem<T> {
  return ("type" in val && val.type === "problem")
}
