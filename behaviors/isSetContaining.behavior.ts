import { behavior } from "esbehavior";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { equalTo, setContaining, stringContaining } from "../src";

export default behavior("isSetContaining", [

  exhibit("the set contains a matching item", () => {
    return setContaining(equalTo(1))(new Set([1, 3, 2]))
  }).check([
    isValidMatchResult(),
    hasActual(new Set([1, 2, 3])),
    hasExpectedMessageText("info(a set that contains a number that equals 1)")
  ]),

  exhibit("the set is empty", () => {
    return setContaining(equalTo(1))(new Set())
  }).check([
    isInvalidMatchResult(),
    hasMessage("The set does not contain the expected element."),
    hasInvalidActual(new Set()),
    hasExpectedMessageText("error(info(a set that contains at least 1 element))")
  ]),

  exhibit("the set does not contain any item that matches", () => {
    return setContaining(equalTo(1))(new Set([4, 3, 2]))
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(new Set([4, 3, 2])),
    hasExpectedMessageText("error(info(a set that contains a number that equals 1))"),
    hasMessage("The set does not contain the expected element.")
  ]),

  exhibit("the set contains a matching item the expected number of times", () => {
    return setContaining(stringContaining("fun"), { times: 2 })(new Set(["fun", "funny", "awesome"]))
  }).check([
    isValidMatchResult(),
    hasActual(new Set(["fun", "funny", "awesome"])),
    hasExpectedMessageText(`info(a set that contains, exactly 2 times, a string that contains "fun")`)
  ]),

  exhibit("the set does not contain an item zero times", () => {
    return setContaining(stringContaining("fun"), { times: 0 })(new Set(["fun", "funny", "awesome"]))
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(new Set(["fun", "funny", "awesome"])),
    hasExpectedMessageText(`error(info(a set that contains, exactly 0 times, a string that contains "fun"))`),
    hasMessage("The set does not contain the expected element.")
  ]),

  exhibit("the set does not contain an item one time", () => {
    return setContaining(stringContaining("fun"), { times: 1 })(new Set(["fun", "funny", "awesome"]))
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(new Set(["fun", "funny", "awesome"])),
    hasExpectedMessageText(`error(info(a set that contains, exactly 1 time, a string that contains "fun"))`),
    hasMessage("The set does not contain the expected element.")
  ]),

  exhibit("the set does not contain an item multiple times", () => {
    return setContaining(stringContaining("fun"), { times: 4 })(new Set(["fun", "funny", "awesome"]))
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(new Set(["fun", "funny", "awesome"])),
    hasExpectedMessageText(`error(info(a set that contains, exactly 4 times, a string that contains "fun"))`),
    hasMessage("The set does not contain the expected element.")
  ])

])