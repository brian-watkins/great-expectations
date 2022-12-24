import { Matcher } from "./matcher"
import { MatchError } from "./matchError"
export { equals, isIdenticalTo, isDefined } from "./basicMatchers"
export { isArrayContaining, isArrayWhereItemAt, isArrayWithLength, isArrayWhere } from "./arrayMatchers"
export type { ArrayContainingOptions, ArrayWhereOptions } from "./arrayMatchers"
export { isStringMatching, isStringWithLength, isStringContaining } from "./stringMatchers"
export type { StringContainingOptions } from "./stringMatchers"
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
