import { behavior } from "esbehavior";
import { isNumberGreaterThanOrEqualTo } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("greaterThanOrEqualTo", [
  
  exhibit("matching a number greater or equal to some other number", () => {
    return isNumberGreaterThanOrEqualTo(10)(10)
  }).check([
    isValidMatchResult(),
    hasActual(10),
    hasExpectedMessageText("info(a number that is greater than or equal to 10)")
  ]),

  exhibit("actual value is not greater than or equal to the expected", () => {
    return isNumberGreaterThanOrEqualTo(10)(4)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not greater than or equal to the expected value."),
    hasInvalidActual(4),
    hasExpectedMessageText("error(info(a number that is greater than or equal to 10))")
  ])

])