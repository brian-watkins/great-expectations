import { behavior } from "esbehavior"
import { isIdenticalTo } from "../src"
import { exhibit, hasActual, hasExpected, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default
  behavior("isIdenticalTo", [
    exhibit("the values are identical", () => isIdenticalTo(7)(7))
      .check([
        isValidMatchResult()
      ]),
    exhibit("the values are not identical", () => isIdenticalTo(7)(5))
      .check([
        isInvalidMatchResult(),
        hasMessage("The actual value is not identical to the expected value."),
        hasExpected(7),
        hasActual(5)
      ])
  ])