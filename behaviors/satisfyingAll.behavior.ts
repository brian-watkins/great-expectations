import { behavior } from "esbehavior"
import { stringContaining } from "../src"
import { exhibit, formattedList, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"
import { satisfying } from "../src"

export default behavior("satisfyingAll", [

  exhibit("all the matchers are satisfied", () => {
    return satisfying([
      stringContaining("is"),
      stringContaining("not")
    ])("This is not a fish!")
  }).check([
    isValidMatchResult(),
    hasActual("This is not a fish!"),
    hasExpectedMessageText(`info(a value that satisfies all of: ${formattedList(["a string that contains \"is\"", "a string that contains \"not\""])})`)
  ]),

  exhibit("one of the matchers is not satisfied", () => {
    return satisfying([
      stringContaining("is"),
      stringContaining("grapes"),
      stringContaining("apple")
    ])("This is not a fish!")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value did not satisfy all of the provided matchers."),
    hasInvalidActual("This is not a fish!"),
    hasExpectedMessageText(`info(a value that satisfies all of: ${formattedList(["a string that contains \"is\"", "error(a string that contains \"grapes\")", "error(a string that contains \"apple\")"])})`)
  ])
])
