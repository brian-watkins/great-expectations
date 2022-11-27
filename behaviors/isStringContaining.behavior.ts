import { behavior } from "esbehavior";
import { isStringContaining } from "../src";
import { exhibit, hasExpectedMessage, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isStringContaining", [

  exhibit("when the value contains the string", () => {
    return isStringContaining("oops")("They said oops!")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("when the value does not contain the string", () => {
    return isStringContaining("oops")("What??")
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value does not contain the expected string."),
    hasInvalidActual("What??"),
    hasExpectedMessage("A string containing 'oops'")
  ])

])