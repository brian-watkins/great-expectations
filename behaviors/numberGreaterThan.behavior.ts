import { behavior } from "esbehavior";
import { isNumberGreaterThan } from "../src";
import { exhibit, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("greaterThan", [
  
  exhibit("matching a number greater than some other number", () => {
    return isNumberGreaterThan(10)(12)
  }).check([
    isValidMatchResult()
  ]),

  exhibit("actual value is not greater than the expected", () => {
    return isNumberGreaterThan(10)(4)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not greater than the expected value."),
    hasInvalidActual(4),
    hasExpectedMessageText("<a number green(greater than 10)>")
  ])

])