import { Description, description, Expected, ExpectedValue, MatchValues } from "./matcher"

export function nameOfType<T>(value: T): string {
  switch (typeof value) {
    case "object": return "an object"
    case "number": return "a number"
    default: return "not done yet"
  }
}

export function expectedCountMessage(expected: Expected<number>): Description {
  if (containsValue(expected)) {
    if (isEqualityOperator(expected) && expected.value == 1) {
      return description("exactly %expected% time", 1)
    }
  
    if (isEqualityOperator(expected)) {
      return description("exactly %expected% times", expected.value)
    }

    // this works now but what about for something like a between matcher
    // ie a custom matcher with an expected value
    return description(`${expected.operator} %expected% times`, expected.value)
  }

  return description("not done yet")
}

export function expectedLengthMessage<T>(values: MatchValues<T>): Description {
  return description("not done yet")
  // if (isEqualityOperator(values)) {
  //   return description("%expected%", values.argument)
  // }

  // return description(`${values.operator} %expected%`, values.argument)
}

function isEqualityOperator<T>(expected: Expected<T>): boolean {
  return expected.operator === "is equal to" || expected.operator === "is identical to"
}

function containsValue<T>(expected: Expected<T>): expected is ExpectedValue<T> {
  return expected.type === "expected-value"
}