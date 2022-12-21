import { behavior } from "esbehavior"
import { isStringContaining } from "../src"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"
import { satisfyingAll } from "../src"

export default behavior("satisfyingAll", [

  exhibit("all the matchers are satisfied", () => {
    return satisfyingAll([
      isStringContaining("is"),
      isStringContaining("not")
    ])("This is not a fish!")
  }).check([
    isValidMatchResult(),
    hasActual("This is not a fish!"),
    hasExpectedMessageText("info(a value that satisfies all of:\n  • a string that contains \"is\"\n  • a string that contains \"not\")")
  ]),

  exhibit("one of the matchers is not satisfied", () => {
    return satisfyingAll([
      isStringContaining("is"),
      isStringContaining("grapes"),
      isStringContaining("apple")
    ])("This is not a fish!")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value did not satisfy all of the provided matchers."),
    hasInvalidActual("This is not a fish!"),
    hasExpectedMessageText("info(a value that satisfies all of:\n  • a string that contains \"is\"\n  • error(a string that contains \"grapes\")\n  • error(a string that contains \"apple\"))")
  ])
])
