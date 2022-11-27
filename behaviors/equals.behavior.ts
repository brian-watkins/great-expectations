import { behavior } from "esbehavior";
import { equals } from "../src";
import { exhibit, hasActual, hasExpectedValue, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("equals", [

  exhibit("the values are deeply equal", () => {
    return equals({ name: "cool dude" })({ name: "cool dude" })
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the values are not deeply equal", () => {
    return equals({ name: "cool dude", count: 7 })({ name: "cool dude", count: 5 })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not equal to the expected value."),
    hasActual({ name: "cool dude", count: 5 }),
    hasExpectedValue({ name: "cool dude", count: 7 }),
  ]),

  exhibit("the values are not strictly deeply equal", () => {
    return equals<number | string>(7)("7")
  }).check([
    isInvalidMatchResult()
  ])

])