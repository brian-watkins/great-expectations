import { behavior } from "esbehavior";
import { stringContaining } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isStringContaining", [

  exhibit("when the value contains the string", () => {
    return stringContaining("oops")("They said oops!")
  }).check([
    isValidMatchResult(),
    hasActual("They said oops!"),
    hasExpectedMessageText("info(a string that contains \"oops\")")
  ]),

  exhibit("when the value does not contain the string", () => {
    return stringContaining("oops")("What??")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not contain the expected string."),
    hasInvalidActual("What??"),
    hasExpectedMessageText("error(info(a string that contains \"oops\"))")
  ]),

  exhibit("when not case-sensitive and the value contains the string with a different case", () => {
    return stringContaining("oops", { caseSensitive: false })("They said OoPS!")
  }).check([
    isValidMatchResult(),
    hasActual("They said OoPS!"),
    hasExpectedMessageText("info(a string that contains (case-insensitive) \"oops\")")
  ]),

  exhibit("when not case-sensitive and the value does not contain the string", () => {
    return stringContaining("oops", { caseSensitive: false })("They said what?!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains (case-insensitive) \"oops\"))")
  ]),

  exhibit("when case-sensitive and the value does not contains the string with the proper case", () => {
    return stringContaining("oops", { caseSensitive: true })("They said OoPS!")
  }).check([
    isInvalidMatchResult(),
  ]),

  exhibit("when the value contains the string the expected number of times", () => {
    return stringContaining("is", { times: 3 })("This is a fish!")
  }).check([
    isValidMatchResult(),
    hasExpectedMessageText("info(a string that contains \"is\" exactly 3 times)")
  ]),

  exhibit("when the value does not contain the string the expected number of times", () => {
    return stringContaining("is", { times: 3 })("This is a bat!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 3 times))")
  ]),

  exhibit("when the value does not contain the string only once", () => {
    return stringContaining("is", { times: 1 })("This is a bat!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 1 time))")
  ]),

  exhibit("when the expected has regexp special characters in it", () => {
    return stringContaining("f.sh", { times: 1 })("fish, f.sh, fosh")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("when the expectation tries to match a negative number of times", () => {
    return stringContaining("f.sh", { times: -11 })("fish, f.sh, f.sh")
  }).check([
    isInvalidMatchResult()
  ]),

  exhibit("when the actual contains the expected at the beginning of the string", () => {
    return stringContaining("hello")("hello how are you")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the actual is expected to contain the expected zero times", () => {
    return stringContaining("is", { times: 0 })("This is not a fish!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 0 times))")
  ])

])