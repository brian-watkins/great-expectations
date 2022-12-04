import { behavior } from "esbehavior"
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"
import { isIdenticalTo, isNumberGreaterThan, isNumberLessThanOrEqualTo, isStringWithLength } from "../src/index"

export default behavior("isStringWithLength", [

  exhibit("matches a string with the expected length", () => {
    return isStringWithLength(4)("blah")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("matches a string when the length satisfies the provided matcher", () => {
    return isStringWithLength(isNumberGreaterThan(5))("This is really cool!")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("matches an empty string", () => {
    return isStringWithLength(0)("")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("matches any non-empty string", () => {
    return isStringWithLength(isNumberGreaterThan(0))("any old string")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("a string with the wrong length fails to match", () => {
    return isStringWithLength(14)("yo yo")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not have the expected length."),
    hasInvalidActual("yo yo"),
    hasExpectedMessageText("a string with length 14")
  ]),

  exhibit("a string with a length that fails to match the length matcher", () => {
    return isStringWithLength(isNumberLessThanOrEqualTo(4))("longer")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("a string with length less than or equal to 4")
  ]),

  exhibit("the identical to matcher is used to specify the length", () => {
    return isStringWithLength(isIdenticalTo(4))("longer")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("a string with length 4")
  ])

])