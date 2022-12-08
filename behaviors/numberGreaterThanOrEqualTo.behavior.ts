import { behavior } from "esbehavior";
import { isNumberGreaterThanOrEqualTo } from "../src";
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("greaterThanOrEqualTo", [
  
  exhibit("matching a number greater or equal to some other number", () => {
    return isNumberGreaterThanOrEqualTo(10)(10)
  }).check([
    isValidMatchResult()
  ]),

  exhibit("actual value is not greater than or equal to the expected", () => {
    return isNumberGreaterThanOrEqualTo(10)(4)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not greater than or equal to the expected value."),
    hasInvalidActual(4),
    hasExpectedMessageText("green(<a number greater than or equal to 10>)")
  ])

])