import { behavior } from "esbehavior";
import { equals, isArrayContaining, isStringContaining } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayContaining", [

  exhibit("the array contains a matching item", () => {
    return isArrayContaining(equals(7))([1, 7, 3, 3])
  }).check([
    isValidMatchResult(),
    hasActual([1, 7, 3, 3]),
    hasExpectedMessageText("info(an array that contains a number that equals 7)")
  ]),

  exhibit("the array does not contain a matching item", () => {
    return isArrayContaining(isStringContaining("hello"))(["goodbye", "bye", "later"])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array does not contain what was expected."),
    hasInvalidActual(["goodbye", "bye", "later"]),
    hasExpectedMessageText("error(info(an array that contains a string that contains \"hello\"))")
  ]),

  exhibit("the array contains the item the expected number of times", () => {
    return isArrayContaining(equals("hello"), { times: 2 })(["hello", "one", "two", "hello", "three"])
  }).check([
    isValidMatchResult(),
    hasExpectedMessageText("info(an array that contains, exactly 2 times, a string that equals \"hello\")")
  ]),

  exhibit("the message shows the array was expected to contain the item zero items", () => {
    return isArrayContaining(equals("fun"), { times: 0 })(["fun", "funny", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(an array that contains, exactly 0 times, a string that equals \"fun\"))")
  ]),

  exhibit("the message shows the array was expected to contain the item one time", () => {
    return isArrayContaining(equals("fun"), { times: 1 })(["fun", "fun", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(an array that contains, exactly 1 time, a string that equals \"fun\"))")
  ]),

  exhibit("the message shows the array was expected to contain the item multiple times", () => {
    return isArrayContaining(equals("fun"), { times: 2 })(["fun", "funny", "sunny"])
  }).check([
    isInvalidMatchResult(),
    hasExpectedMessageText("error(info(an array that contains, exactly 2 times, a string that equals \"fun\"))")
  ]),

])