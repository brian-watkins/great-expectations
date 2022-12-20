import { behavior } from "esbehavior"
import { isIdenticalTo } from "../src"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isIdenticalTo", [

  exhibit("the values are identical", () => isIdenticalTo(7)(7))
    .check([
      isValidMatchResult(),
      hasActual(7),
      hasExpectedMessageText("info(a number that is identical to 7)")
    ]),

  exhibit("the values are not identical", () => isIdenticalTo(7)(5))
    .check([
      isInvalidMatchResult(),
      hasMessage("The actual value is not identical to the expected value."),
      hasExpectedMessageText("error(info(a number that is identical to 7))"),
      hasInvalidActual(5)
    ])

])