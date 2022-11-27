import { behavior } from "esbehavior";
import { isArrayWithLength } from "../src";
import { exhibit, hasExpectedMessage, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayWithLength", [

  exhibit("the array has the expected length", () => {
    return isArrayWithLength(4)([1, 2, 3, 4])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the array does not have the expected length", () => {
    return isArrayWithLength(3)([1, 2, 3, 4])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array length (4) is unexpected."),
    hasInvalidActual([1, 2, 3, 4]),
    hasExpectedMessage("An array with length 3")
  ])

])