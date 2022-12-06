import { Matcher } from "./matcher"
import { MatchError } from "./matchError"
export { equals, isIdenticalTo } from "./basicMatchers"
export { isArrayContaining, isArrayWithLength, isArrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { isStringWithLength, isStringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
export { isNumberLessThan, isNumberLessThanOrEqualTo, isNumberGreaterThan, isNumberGreaterThanOrEqualTo } from "./numberMatchers"
export { satisfyingAll } from "./satisfyingMatchers"

export function expect<T>(value: T, matcher: Matcher<T>): void {
  const matchResult = matcher(value)
  switch (matchResult.type) {
    case "valid":
      return
    case "invalid":
      throw new MatchError(matchResult)
  }
}
