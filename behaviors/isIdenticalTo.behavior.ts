import { behavior } from "esbehavior"
import { identicalTo } from "../src/index.js"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMatcherDescription, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js"

export default behavior("isIdenticalTo", [

  exhibit("identicalTo", () => {
    return identicalTo("something cool")
  }).check([
    hasMatcherDescription("info(a string that is identical to \"something cool\")")
  ]),


  exhibit("the values are identical", () => identicalTo(7)(7))
    .check([
      isValidMatchResult(),
      hasActual(7),
      hasExpectedMessageText("info(a number that is identical to 7)")
    ]),

  exhibit("the values are not identical", () => identicalTo(7)(5))
    .check([
      isInvalidMatchResult(),
      hasMessage("The actual value is not identical to the expected value."),
      hasInvalidActual(5),
      hasExpectedMessageText("error(info(a number that is identical to 7))")
    ]),

  exhibit("the expected value is undefined", () => {
      return identicalTo<string | undefined>(undefined)("blah")
    }).check([
      isInvalidMatchResult(),
      hasInvalidActual("blah"),
      hasExpectedMessageText("error(info(a variable that is undefined))")
    ])

])