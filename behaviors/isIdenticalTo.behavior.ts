import { behavior } from "esbehavior"
import { identicalTo } from "../src"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isIdenticalTo", [

  exhibit("the values are identical", () => identicalTo(7)(7))
    .check([
      isValidMatchResult(),
      hasActual(7),
      hasExpectedMessageText("info(a number that is identical to 7)")
    ]),

  exhibit("the values are not identical", () => identicalTo(7)(5))
    .check([
      isInvalidMatchResult(),
      hasMessage("The actual value is not identical to the expected value."),
      hasInvalidActual(5),
      hasExpectedMessageText("error(info(a number that is identical to 7))")
    ]),

  exhibit("the expected value is undefined", () => {
      return identicalTo<string | undefined>(undefined)("blah")
    }).check([
      isInvalidMatchResult(),
      hasInvalidActual("blah"),
      hasExpectedMessageText("error(info(a variable that is undefined))")
    ])

])