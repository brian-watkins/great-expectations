import { behavior } from "esbehavior";
import { equals, isArrayContaining, isStringContaining } from "../src";
import { expectedMessage, unsatisfiedExpectedValue } from "../src/matcher";
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
  ]),

  exhibit("the array contains the item the expected number of times", () => {
    return isArrayContaining(equals("hello"))(["hello", "one", "two", "hello", "three"])
  }).check([
    isValidMatchResult(),
  ]),

  (m) => m.pick() && exhibit("the array does not contain the item the expected number of times", () => {
    return isArrayContaining(equals("fun"), { times: 0 })(["fun", "funny", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessage("An array containing exactly 0 times:", unsatisfiedExpectedValue("fun"))
  ]),

  (m) => m.pick() && exhibit("the array does not contain the item the expected number of times", () => {
    return isArrayContaining(equals("fun"), { times: 2 })(["fun", "funny", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessage("An array containing exactly 2 times:", unsatisfiedExpectedValue("fun"))
  ])

  // also should probably write a test for when expect it to contain zero times

])