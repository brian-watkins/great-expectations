import { behavior } from "esbehavior";
import { isNumberLessThan } from "../src";
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("lessThan", [
  
  exhibit("matching a number less than some other number", () => {
    return isNumberLessThan(10)(7)
  }).check([
    isValidMatchResult()
  ]),

  exhibit("actual value is not less than the expected", () => {
    return isNumberLessThan(10)(20)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not less than the expected value."),
    hasInvalidActual(20),
    hasExpectedMessageText("green(<a number less than 10>)")
  ])

])