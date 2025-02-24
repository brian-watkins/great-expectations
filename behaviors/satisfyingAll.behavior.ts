import { behavior } from "esbehavior"
import { stringContaining } from "../src/index.js"
import { exhibit, formattedList, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js"
import { satisfying } from "../src/index.js"

export default behavior("satisfyingAll", [

  exhibit("all the matchers are satisfied", () => {
    return satisfying<string>([
      stringContaining("is"),
      stringContaining("not")
    ])("This is not a fish!")
  }).check([
    isValidMatchResult(),
    hasActual("This is not a fish!"),
    hasExpectedMessageText(`info(a value that satisfies all of: ${formattedList(["a string that contains \"is\"", "a string that contains \"not\""])})`)
  ]),

  exhibit("one of the matchers is not satisfied", () => {
    return satisfying<string>([
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
