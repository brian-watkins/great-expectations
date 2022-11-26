import { behavior } from "esbehavior";
import { isTrue } from "../src";
import { exhibit, hasMessage, hasNoValues, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default
  behavior("isTrue", [
    exhibit("the value is actually true", () => isTrue()(true))
      .check([
        isValidMatchResult()
      ]),
    exhibit("the value is actually false", () => isTrue()(false))
      .check([
        isInvalidMatchResult(),
        hasMessage("The actual value should be true, but it is not."),
        hasNoValues()
      ])
  ])