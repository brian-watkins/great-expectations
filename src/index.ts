import equal from "deep-equal"
import { Invalid, invalidActualValue, Matcher, unsatisfiedExpectedValue, Valid } from "./matcher"
import { MatchError } from "./matchError"
export { isArrayContaining, isArrayWithLength, isArrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { isStringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
export { isNumberLessThan, isNumberLessThanOrEqualTo, isNumberGreaterThan } from "./numberMatchers"

export function expect<T>(value: T, matcher: Matcher<T>): void {
  const matchResult = matcher(value)
  switch (matchResult.type) {
    case "valid":
      return
    case "invalid":
      throw new MatchError(matchResult)
  }
}

// Matchers

export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (actual === expected) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not identical to the expected value.", {
        actual: invalidActualValue(actual),
        expected: unsatisfiedExpectedValue(expected)
      })
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (equal(actual, expected, { strict: true })) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not equal to the expected value.", {
        actual: invalidActualValue(actual),
        expected: unsatisfiedExpectedValue(expected)
      })
    }
  }
}
