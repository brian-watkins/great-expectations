import { behavior } from "esbehavior";
import { isArrayWithLength } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayWithLength", [

  exhibit("the array has the expected length", () => {
    return isArrayWithLength(4)([1, 2, 3, 4])
  }).check([
    isValidMatchResult(),
    hasActual([1, 2, 3, 4]),
    hasExpectedMessageText("info(an array with length 4)")
  ]),

  exhibit("the array does not have the expected length", () => {
    return isArrayWithLength(3)([1, 2, 3, 4])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array length (4) is unexpected."),
    hasInvalidActual([1, 2, 3, 4]),
    hasExpectedMessageText("error(info(an array with length 3))")
  ]),

])