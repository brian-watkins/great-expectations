import { Expected, expectedMessage, expectedValue, MatchValues } from "./matcher"

export function expectedCountMessage(values: MatchValues): Expected {
  if (isEqualityOperator(values) && values.argument == 1) {
    return expectedMessage("exactly %expected% time", expectedValue(1))
  }

  if (isEqualityOperator(values)) {
    return expectedMessage("exactly %expected% times", expectedValue(values.argument))
  }

  return expectedMessage(`${values.operator} %expected% times`, expectedValue(values.argument))
}

export function expectedLengthMessage(values: MatchValues): Expected {
  if (isEqualityOperator(values)) {
    return expectedValue(values.argument)
  }

  return expectedMessage(`${values.operator} %expected%`, expectedValue(values.argument))
}

function isEqualityOperator(values: MatchValues): boolean {
  return values.operator === "equals" || values.operator === "identical to"
}
