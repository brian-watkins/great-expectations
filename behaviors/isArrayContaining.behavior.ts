import { behavior } from "esbehavior";
import { equals, isArrayContaining, isStringContaining } from "../src";
import { expectedMessage } from "../src/matcher";
import { exhibit, hasExpectedMessage, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayContaining", [

  exhibit("the array contains a matching item", () => {
    return isArrayContaining(equals(7))([1, 7, 3, 3])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the array does not contain a matching item", () => {
    return isArrayContaining(isStringContaining("hello"))(["goodbye", "bye", "later"])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array does not contain any item that matches."),
    hasInvalidActual(["goodbye", "bye", "later"]),
    hasExpectedMessage("An array containing:", expectedMessage("A string containing 'hello'"))
  ])

])