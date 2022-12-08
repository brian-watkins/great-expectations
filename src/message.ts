import { Expected, description, expectedValue, MatchValues } from "./matcher"

export function expectedCountMessage(values: MatchValues): Expected {
  if (isEqualityOperator(values) && values.argument == 1) {
    return expectedValue(description("exactly %expected% time", expectedValue(1)))
  }

  if (isEqualityOperator(values)) {
    return expectedValue(description("exactly %expected% times", expectedValue(values.argument)))
  }

  return expectedValue(description(`${values.operator} %expected% times`, expectedValue(values.argument)))
}

export function expectedLengthMessage(values: MatchValues): Expected {
  if (isEqualityOperator(values)) {
    return expectedValue(values.argument)
  }

  return expectedValue(description(`${values.operator} %expected%`, expectedValue(values.argument)))
}

function isEqualityOperator(values: MatchValues): boolean {
  return values.operator === "equals" || values.operator === "identical to"
}
