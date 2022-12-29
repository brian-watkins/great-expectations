import { behavior } from "esbehavior"
import { stringMatching } from "../src"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isStringMatching", [

  exhibit("the regex matches the given string", () => {
    return stringMatching(/fun/)("funny stuff!")
  }).check([
    isValidMatchResult(),
    hasActual("funny stuff!"),
    hasExpectedMessageText("info(a string matching /fun/)")
  ]),

  exhibit("the regex fails to match the given string", () => {
    return stringMatching(/^thing/)("nothing good")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not match the regular expression."),
    hasInvalidActual("nothing good"),
    hasExpectedMessageText("error(info(a string matching /^thing/))")
  ])

])
