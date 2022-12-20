import { behavior } from "esbehavior";
import { isNumberLessThanOrEqualTo } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("lessThanOrEqualTo", [
  
  exhibit("matching a number less or equal to some other number", () => {
    return isNumberLessThanOrEqualTo(10)(10)
  }).check([
    isValidMatchResult(),
    hasActual(10),
    hasExpectedMessageText("info(a number that is less than or equal to 10)")
  ]),

  exhibit("actual value is not less than or equal to the expected", () => {
    return isNumberLessThanOrEqualTo(10)(20)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not less than or equal to the expected value."),
    hasInvalidActual(20),
    hasExpectedMessageText("error(info(a number that is less than or equal to 10))")
  ])

])