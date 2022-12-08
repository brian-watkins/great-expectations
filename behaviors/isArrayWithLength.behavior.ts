import { behavior } from "esbehavior";
import { isArrayWithLength, isNumberGreaterThan, isNumberLessThanOrEqualTo } from "../src";
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayWithLength", [

  exhibit("the array has the expected length", () => {
    return isArrayWithLength(4)([1, 2, 3, 4])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the array's length satisfies the matcher", () => {
    return isArrayWithLength(isNumberGreaterThan(4))([1, 2, 3, 4, 5])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the array does not have the expected length", () => {
    return isArrayWithLength(3)([1, 2, 3, 4])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array length (4) is unexpected."),
    hasInvalidActual([1, 2, 3, 4]),
    hasExpectedMessageText("error(info(an array with length 3))")
  ]),

  exhibit("the array length does not match the provided matcher", () => {
    return isArrayWithLength(isNumberLessThanOrEqualTo(4))([1, 2, 3, 4, 5])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array length (5) is unexpected."),
    hasInvalidActual([1, 2, 3, 4, 5]),
    hasExpectedMessageText("error(info(an array with length less than or equal to 4))")
  ])

])