import { behavior } from "esbehavior";
import { isNumberLessThan } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("lessThan", [
  
  exhibit("matching a number less than some other number", () => {
    return isNumberLessThan(10)(7)
  }).check([
    isValidMatchResult(),
    hasActual(7),
    hasExpectedMessageText("info(a number that is less than 10)")
  ]),

  exhibit("actual value is not less than the expected", () => {
    return isNumberLessThan(10)(20)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not less than the expected value."),
    hasInvalidActual(20),
    hasExpectedMessageText("error(info(a number that is less than 10))")
  ])

])