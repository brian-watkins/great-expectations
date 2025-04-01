import { behavior } from "esbehavior";
import { arrayWithLength } from "../src/index.js";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js";

export default behavior("isArrayWithLength", [

  exhibit("the array has the expected length", () => {
    return arrayWithLength(4)([1, 2, 3, 4])
  }).check([
    isValidMatchResult(),
    hasActual([1, 2, 3, 4]),
    hasExpectedMessageText("info(an array with exactly 4 elements)")
  ]),

  exhibit("the array does not have the expected length", () => {
    return arrayWithLength(3)([1, 2, 3, 4])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array length (4) is unexpected."),
    hasInvalidActual([1, 2, 3, 4]),
    hasExpectedMessageText("error(info(an array with exactly 3 elements))")
  ]),

])