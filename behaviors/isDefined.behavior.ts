import { behavior } from "esbehavior"
import { isDefined } from "../src"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isDefined", [

  exhibit("the value is defined", () => {
    return isDefined()("")
  }).check([
    isValidMatchResult(),
    hasActual(""),
    hasExpectedMessageText("info(a value that is defined)")
  ]),

  exhibit("the value is not defined", () => {
    return isDefined()(undefined)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not defined."),
    hasInvalidActual(undefined),
    hasExpectedMessageText("error(info(a value that is defined))")
  ])

])
