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
  ]),

  exhibit("when not case-sensitive and the value contains the string with a different case", () => {
    return isStringContaining("oops", { caseSensitive: false })("They said OoPS!")
  }).check([
    isValidMatchResult()
  ]),

  exhibit("when not case-sensitive and the value does not contain the string", () => {
    return isStringContaining("oops", { caseSensitive: false })("They said what?!")
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessage("A string containing 'oops' (case-insensitive)")
  ]),

  exhibit("when case-sensitive and the value does not contains the string with the proper case", () => {
    return isStringContaining("oops", { caseSensitive: true })("They said OoPS!")
  }).check([
    isInvalidMatchResult(),
  ]),

])