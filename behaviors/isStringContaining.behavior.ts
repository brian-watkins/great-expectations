import { behavior } from "esbehavior";
import { isIdenticalTo, isNumberGreaterThan, isNumberLessThan, isStringContaining } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isStringContaining", [

  exhibit("when the actual contains the string", () => {
    return isStringContaining("oops")("They said oops!")
  }).check([
    isValidMatchResult(),
    hasActual("They said oops!"),
    hasExpectedMessageText("info(a string that contains \"oops\")")
  ]),

  exhibit("when the actual does not contain the string", () => {
    return isStringContaining("oops")("What??")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not contain the expected string."),
    hasInvalidActual("What??"),
    hasExpectedMessageText("error(info(a string that contains \"oops\"))")
  ]),

  exhibit("when not case-sensitive and the value contains the string with a different case", () => {
    return isStringContaining("oops", { caseSensitive: false })("They said OoPS!")
  }).check([
    isValidMatchResult(),
    hasExpectedMessageText("info(a string that contains \"oops\" (case-insensitive))")
  ]),

  exhibit("when not case-sensitive and the value does not contain the string", () => {
    return isStringContaining("oops", { caseSensitive: false })("They said what?!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"oops\" (case-insensitive)))")
  ]),

  exhibit("when case-sensitive and the value does not contains the string with the proper case", () => {
    return isStringContaining("oops", { caseSensitive: true })("They said OoPS!")
  }).check([
    isInvalidMatchResult(),
  ]),

  exhibit("when the value contains the string the expected number of times", () => {
    return isStringContaining("is", { times: 3 })("This is a fish!")
  }).check([
    isValidMatchResult(),
    hasActual("This is a fish!"),
    hasExpectedMessageText("info(a string that contains \"is\" exactly 3 times)")
  ]),

  exhibit("when the value does not contain the string the expected number of times", () => {
    return isStringContaining("is", { times: 3 })("This is a bat!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 3 times))")
  ]),

  exhibit("when the value does not contain the string only once", () => {
    return isStringContaining("is", { times: 1 })("This is a bat!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 1 time))")
  ]),

  exhibit("when the expected has regexp special characters in it", () => {
    return isStringContaining("f.sh", { times: 1 })("fish, f.sh, fosh")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("when the expectation tries to match a negative number of times", () => {
    return isStringContaining("f.sh", { times: -11 })("fish, f.sh, f.sh")
  }).check([
    isInvalidMatchResult()
  ]),

  exhibit("the match count satsifies the given matcher", () => {
    return isStringContaining("is", { times: isNumberGreaterThan(1) })("This is not a fish!")
  }).check([
    isValidMatchResult(),
    hasExpectedMessageText("info(a string that contains \"is\" greater than 1 times)")
  ]),

  exhibit("the match count fails to satisfy the given matcher", () => {
    return isStringContaining("is", { times: isNumberLessThan(2) })("This is not a fish!")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not contain the expected string."),
    hasInvalidActual("This is not a fish!"),
    hasExpectedMessageText("error(info(a string that contains \"is\" less than 2 times))")
  ]),

  exhibit("when the actual contains the expected at the beginning of the string", () => {
    return isStringContaining("hello")("hello how are you")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the identicalTo matcher is used for the expected count", () => {
    return isStringContaining("is", { times: isIdenticalTo(1) })("This is not a fish!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 1 time))")
  ]),

  exhibit("the actual is expected to contain the expected zero times", () => {
    return isStringContaining("is", { times: 0 })("This is not a fish!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(a string that contains \"is\" exactly 0 times))")
  ])

])