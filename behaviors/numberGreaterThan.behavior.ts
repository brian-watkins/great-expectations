import { behavior } from "esbehavior";
import { isNumberGreaterThan } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("greaterThan", [
  
  exhibit("matching a number greater than some other number", () => {
    return isNumberGreaterThan(10)(12)
  }).check([
    isValidMatchResult(),
    hasActual(12),
    hasExpectedMessageText("info(a number that is greater than 10)")
  ]),

  exhibit("actual value is not greater than the expected", () => {
    return isNumberGreaterThan(10)(4)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not greater than the expected value."),
    hasInvalidActual(4),
    hasExpectedMessageText("error(info(a number that is greater than 10))")
  ])

])