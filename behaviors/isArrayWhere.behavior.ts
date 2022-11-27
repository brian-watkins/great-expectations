import { behavior } from "esbehavior";
import { equals, isArrayWhere } from "../src";
import { actualValue, expectedValue, invalidActualValue, unsatisfiedExpectedValue } from "../src/matcher";
import { exhibit, hasActual, hasExpectedMessage, hasExpectedValue, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

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
    hasInvalidActual([1, 2]),
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
    hasMessage("The array failed to match:\n\n  at Actual[1]: The actual value is not equal to the expected value.\n\n  at Actual[2]: The actual value is not equal to the expected value."),
    hasExpectedValue([expectedValue(1), unsatisfiedExpectedValue(2), unsatisfiedExpectedValue(3)]),
    hasActual([actualValue(1), invalidActualValue(6), invalidActualValue(5)]),
  ])

])
