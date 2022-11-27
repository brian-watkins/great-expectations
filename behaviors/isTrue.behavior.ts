import { behavior } from "esbehavior";
import { isTrue } from "../src";
import { exhibit, hasInvalidActual, hasMessage, hasUnsatisfiedExpectedValue, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isTrue", [

  exhibit("the value is actually true", () => isTrue()(true))
    .check([
      isValidMatchResult()
    ]),

  exhibit("the value is actually false", () => isTrue()(false))
    .check([
      isInvalidMatchResult(),
      hasMessage("The actual value should be true, but it is not."),
      hasUnsatisfiedExpectedValue(true),
      hasInvalidActual(false)
    ])

])