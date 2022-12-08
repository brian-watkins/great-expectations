import { behavior } from "esbehavior";
import { equals, isArrayWhere } from "../src";
import { actualValue, expectedValue, invalidActualValue, unsatisfiedExpectedValue } from "../src/matcher";
import { exhibit, hasActual, hasExpectedMessageText, hasExpectedValue, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

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
    hasMessage("The array length (2) is unexpected."),
    hasInvalidActual([1, 2]),
    hasExpectedMessageText("green(<an array with length 3>)")
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
  ]),

  exhibit("the array is fails to match when not ordered as expected", () => {
    return isArrayWhere([
      equals(1),
      equals(2),
      equals(3)
    ], { withAnyOrder: false })([3, 1, 2])
  }).check([
    isInvalidMatchResult()
  ]),

  exhibit("the array is matched regardless of order", () => {
    return isArrayWhere([
      equals(1),
      equals(2),
      equals(3)
    ], { withAnyOrder: true })([3, 1, 2])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the unexpected value is displayed for an array that fails to match regardless of order", () => {
    return isArrayWhere([
      equals(1),
      equals(2),
      equals(3)
    ], { withAnyOrder: true })([ 3, 6, 2 ])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array failed to match."),
    hasExpectedValue([unsatisfiedExpectedValue(1), expectedValue(2), expectedValue(3)]),
    hasActual([actualValue(3), invalidActualValue(6), actualValue(2)])
  ]),

  exhibit("the correct unexpected value is displayed for identical matchers within the array", () => {
    return isArrayWhere([
      equals(2),
      equals(2),
      equals(3)
    ], { withAnyOrder: true })([ 3, 6, 2 ])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array failed to match."),
    hasExpectedValue([expectedValue(2), unsatisfiedExpectedValue(2), expectedValue(3)]),
    hasActual([actualValue(3), invalidActualValue(6), actualValue(2)])
  ])

])
