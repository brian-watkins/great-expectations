import { behavior } from "esbehavior";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { setWithSize } from "../src";

export default behavior("setWithSize", [

  exhibit("the set has the expected size", () => {
    return setWithSize(4)(new Set([1, 2, 3, 4]))
  }).check([
    isValidMatchResult(),
    hasActual(new Set([1, 2, 3, 4])),
    hasExpectedMessageText(`info(a set with exactly 4 elements)`),
  ]),

  exhibit("the set does not have the expected size", () => {
    return setWithSize(1)(new Set([1, 2, 3, 4]))
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(new Set([1, 2, 3, 4])),
    hasExpectedMessageText(`error(info(a set with exactly 1 element))`),
    hasMessage("The set size (4) is unexpected.")
  ])

])