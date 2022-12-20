import { behavior } from "esbehavior"
import { equals, isArrayWhere, isNumberGreaterThan, isNumberLessThan, isNumberLessThanOrEqualTo, isStringContaining } from "../src"
import { exhibit, hasExpectedMessageText, hasExpectedValue, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"
import { satisfyingAll } from "../src"

export default behavior("satisfyingAll", [

  exhibit("all the matchers are satisfied", () => {
    return satisfyingAll([
      isStringContaining("is"),
      isStringContaining("not")
    ])("This is not a fish!")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("one of the matchers is not satisfied", () => {
    return satisfyingAll([
      isNumberGreaterThan(5),
      isNumberLessThan(8),
      equals(7),
    ])(20)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value did not satisfy all of the provided matchers."),
    hasInvalidActual(20),
    hasExpectedMessageText("info(a number that is (greater than 5 and error(less than 8) and error(equal to 7)))")
  ]),

  // (m) => m.pick() && exhibit("satisfyingAll is used as a submatcher", () => {
  //   return isArrayWhere([
  //     satisfyingAll([
  //       isNumberGreaterThan(5),
  //       isNumberLessThanOrEqualTo(9)
  //     ]),
  //     equals(3)
  //   ])([ 19, 3 ])
  // }).check([
  //   isInvalidMatchResult(),
  //   hasExpectedValue([
  //     "a number that is greater than 5 and less than or equal to 9"
  //     // problem(description("%expected%", 5)),
  //     // 3
  //   ])
  // ])

])
