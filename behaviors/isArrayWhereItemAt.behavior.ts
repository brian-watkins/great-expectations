import { behavior } from "esbehavior"
import { equalTo, arrayWhereItemAt } from "../src"
import { problem } from "../src/matcher"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isArrayWhereItemAt", [

  exhibit("the item at the specified index matches", () => {
    return arrayWhereItemAt(2, equalTo(3))([1, 2, 3])
  }).check([
    isValidMatchResult(),
    hasActual([1, 2, 3]),
    hasExpectedMessageText("info(an array where the item at index 2 is a number that equals 3)")
  ]),

  exhibit("the item at the specified index does not match", () => {
    return arrayWhereItemAt(3, equalTo(1))([1, 2, 3, 4, 5])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The item at index 3 did not match."),
    hasActual([1, 2, 3, problem(4), 5]),
    hasExpectedMessageText("error(info(an array where the item at index 3 is a number that equals 1))")
  ]),

  exhibit("the array has no item at the specified index", () => {
    return arrayWhereItemAt(17, equalTo(2))([1, 2, 3, 4])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array has no item at index 17."),
    hasInvalidActual([1, 2, 3, 4]),
    hasExpectedMessageText("error(info(an array with some item to check at index 17))")
  ])

])
