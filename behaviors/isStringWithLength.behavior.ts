import { behavior } from "esbehavior"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"
import { stringWithLength } from "../src/index"

export default behavior("isStringWithLength", [

  exhibit("matches a string with the expected length", () => {
    return stringWithLength(4)("blah")
  }).check([
    isValidMatchResult(),
    hasActual("blah"),
    hasExpectedMessageText("info(a string with length 4)")
  ]),

  exhibit("matches an empty string", () => {
    return stringWithLength(0)("")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("a string with the wrong length fails to match", () => {
    return stringWithLength(14)("yo yo")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not have the expected length."),
    hasInvalidActual("yo yo"),
    hasExpectedMessageText("error(info(a string with length 14))")
  ]),

])