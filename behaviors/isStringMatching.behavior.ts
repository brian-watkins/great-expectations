import { behavior } from "esbehavior"
import { stringMatching } from "../src/index.js"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js"

export default behavior("isStringMatching", [

  exhibit("the regex matches the given string", () => {
    return stringMatching(/fun/)("funny stuff!")
  }).check([
    isValidMatchResult(),
    hasActual("funny stuff!"),
    hasExpectedMessageText("info(a string matching /fun/)")
  ]),

  exhibit("the regex matches the expected number of times", () => {
    return stringMatching(/fun/g, { times: 3 })("fun fun fun!")
  }).check([
    isValidMatchResult(),
    hasActual("fun fun fun!"),
    hasExpectedMessageText("info(a string matching /fun/g exactly 3 times)")
  ]),

  exhibit("the regex fails to match the given string", () => {
    return stringMatching(/^thing/)("nothing good")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not match the regular expression."),
    hasInvalidActual("nothing good"),
    hasExpectedMessageText("error(info(a string matching /^thing/))")
  ]),

  exhibit("the regex matches the given string an unexpected number of times", () => {
    return stringMatching(/fun/ig, { times: 2 })("fun FuN fun!")
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual("fun FuN fun!"),
    hasMessage("The actual value does not match the regular expression."),
    hasExpectedMessageText("error(info(a string matching /fun/gi exactly 2 times))")
  ])

])
