import { behavior } from "esbehavior";
import { isFalse } from "../src";
import { exhibit, isValidMatchResult, isInvalidMatchResult, hasMessage, hasInvalidActual, hasUnsatisfiedExpectedValue } from "./helpers";

export default behavior("isFalse", [

  exhibit("when the value is actually false", () => isFalse()(false))
    .check([
      isValidMatchResult()
    ]),

  exhibit("when the value is actually true", () => isFalse()(true))
    .check([
      isInvalidMatchResult(),
      hasMessage("The actual value should be false, but it is not."),
      hasInvalidActual(true),
      hasUnsatisfiedExpectedValue(false)
    ])

])