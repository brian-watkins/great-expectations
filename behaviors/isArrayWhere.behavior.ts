import { behavior } from "esbehavior";
import { equals, isArrayWhere } from "../src";
import { expectedValue } from "../src/matcher";
import { exhibit, hasActual, hasExpectedMessage, hasExpectedValue, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayWhere", [

  exhibit("the array matches", () => {
    return isArrayWhere([
      equals(1),
      equals(2),
      equals(3)
    ])([1, 2, 3])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the actual array does not have the expected number of items", () => {
    return isArrayWhere([equals(1), equals(2), equals(3)])([1, 2])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array does not have the expected length."),
    hasActual([1, 2]),
    hasExpectedMessage("An array with length 3")
  ]),

  exhibit("the array fails to match at an item", () => {
    return isArrayWhere([
      equals(1),
      equals(2),
      equals(3)
    ])([1, 6, 5])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array failed to match."),
    hasExpectedValue([expectedValue(1), expectedValue(2), expectedValue(3)]),
    hasActual([1, 6, 5]),
  ])

])
