import { behavior } from "esbehavior"
import { isIdenticalTo } from "../src"
import { exhibit, hasInvalidActual, hasMessage, hasUnsatisfiedExpectedValue, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isIdenticalTo", [

  exhibit("the values are identical", () => isIdenticalTo(7)(7))
    .check([
      isValidMatchResult()
    ]),

  exhibit("the values are not identical", () => isIdenticalTo(7)(5))
    .check([
      isInvalidMatchResult(),
      hasMessage("The actual value is not identical to the expected value."),
      hasUnsatisfiedExpectedValue(7),
      hasInvalidActual(5)
    ])

])