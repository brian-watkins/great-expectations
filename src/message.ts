import { Description, description, MatchValues } from "./matcher"

export function expectedCountMessage(values: MatchValues): Description {
  if (isEqualityOperator(values) && values.argument == 1) {
    return description("exactly %expected% time", 1)
  }

  if (isEqualityOperator(values)) {
    return description("exactly %expected% times", values.argument)
  }

  return description(`${values.operator} %expected% times`, values.argument)
}

export function expectedLengthMessage(values: MatchValues): Description {
  if (isEqualityOperator(values)) {
    return description("%expected%", values.argument)
  }

  return description(`${values.operator} %expected%`, values.argument)
}

function isEqualityOperator(values: MatchValues): boolean {
  return values.operator === "equals" || values.operator === "identical to"
}
