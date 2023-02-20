import { behavior } from "esbehavior"
import { defined } from "../src/index.js"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js"

export default behavior("isDefined", [

  exhibit("the value is defined", () => {
    return defined()("")
  }).check([
    isValidMatchResult(),
    hasActual(""),
    hasExpectedMessageText("info(a value that is defined)")
  ]),

  exhibit("the value is not defined", () => {
    return defined()(undefined)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not defined."),
    hasInvalidActual(undefined),
    hasExpectedMessageText("error(info(a value that is defined))")
  ])

])
