import { behavior } from "esbehavior";
import { equals, isArrayContaining, isNumberGreaterThan, isNumberLessThan, isNumberLessThanOrEqualTo, isStringContaining } from "../src";
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

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
    hasMessage("The array does not contain what was expected."),
    hasInvalidActual(["goodbye", "bye", "later"]),
    hasExpectedMessageText("an array containing a string containing \"hello\"")
  ]),

  exhibit("the array contains the item the expected number of times", () => {
    return isArrayContaining(equals("hello"))(["hello", "one", "two", "hello", "three"])
  }).check([
    isValidMatchResult(),
  ]),

  exhibit("when a matcher for times is supplied and the array matches", () => {
    return isArrayContaining(equals("hello"), { times: isNumberGreaterThan(1) })([
      "hello",
      "one",
      "two",
      "hello",
      "three"
    ])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the message shows the array was expected to contain the item zero items", () => {
    return isArrayContaining(equals("fun"), { times: 0 })(["fun", "funny", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("an array containing, exactly 0 times, \"fun\"")
  ]),

  exhibit("the message shows the array was expected to contain the item one time", () => {
    return isArrayContaining(equals("fun"), { times: 1 })(["fun", "fun", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("an array containing, exactly 1 time, \"fun\"")
  ]),

  exhibit("the message shows the array was expected to contain the item multiple times", () => {
    return isArrayContaining(equals("fun"), { times: 2 })(["fun", "funny", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("an array containing, exactly 2 times, \"fun\"")
  ]),

  exhibit("when a matcher is supplied for times and the array does not satisfy it", () => {
    return isArrayContaining(isNumberLessThanOrEqualTo(4), { times: isNumberLessThan(3) })([4, 4, 4, 4, 16])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array does not contain what was expected."),
    hasInvalidActual([4, 4, 4, 4, 16]),
    hasExpectedMessageText("an array containing, less than 3 times, a number less than or equal to 4")
  ]),

  exhibit("the array matches on all elements but fails to satisfy the times matcher", () => {
    return isArrayContaining(isNumberLessThanOrEqualTo(4), { times: 3 })([4, 4, 4, 4, 1])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array does not contain what was expected."),
    hasInvalidActual([4, 4, 4, 4, 1]),
    hasExpectedMessageText("an array containing, exactly 3 times, a number less than or equal to 4")
  ])

])