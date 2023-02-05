import { behavior } from "esbehavior"
import { assignedWith, equalTo,  } from "../src"
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("assignedWith", [

  exhibit("the variable is assigned a value that matches the provided matcher", () => {
    return assignedWith(equalTo(3))(3)
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the variable is assigned a value that does not match the provided matcher", () => {
    return assignedWith(equalTo(17))(3)
  }).check([
    isInvalidMatchResult()
  ]),

  exhibit("the variable is not assigned a value", () => {
    return assignedWith(equalTo(3))(undefined)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual variable is not assigned a value."),
    hasInvalidActual(undefined),
    hasExpectedMessageText("error(info(a variable that is assigned a value))")
  ])

])
