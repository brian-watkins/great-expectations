import { behavior } from "esbehavior"
import { isNumberGreaterThan, isNumberLessThan, isStringContaining } from "../src"
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"
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
      isNumberLessThan(8)
    ])(20)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value did not satisfy all of the provided matchers."),
    hasInvalidActual(20),
    hasExpectedMessageText("a value that satisfies all of:\n  a number greater than 5\n  a number less than 8")
  ])

])