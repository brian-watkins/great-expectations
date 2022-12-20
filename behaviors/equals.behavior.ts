import { behavior } from "esbehavior";
import { equals } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("equals", [

  exhibit("the values are deeply equal", () => {
    return equals({ name: "cool dude" })({ name: "cool dude" })
  }).check([
    isValidMatchResult(),
    hasActual({ name: "cool dude" }),
    // property("the actual value is valid", (result) => {
    //   assert.deepEqual(result.values.actual, { name: "cool dude" })
    // }),
    hasExpectedMessageText("info(an object that is equal to { name: \"cool dude\" })")
    // property("the expected description is satisfied", (result) => {
    //   assert.deepEqual(stringify(result.values.expected.representation, testFormatter), "info(an object that is equal to { name: \"cool dude\" })")
    // })
    // hasActual({ name: "cool dude" })
  ]),

  exhibit("the values are not deeply equal", () => {
    return equals({ name: "cool dude", count: 7 })({ name: "cool dude", count: 5 })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not equal to the expected value."),
    hasInvalidActual({ name: "cool dude", count: 5 }),
    // hasUnsatisfiedExpectedValue({ name: "cool dude", count: 7 }),
    hasExpectedMessageText("error(info(an object that is equal to { name: \"cool dude\", count: 7 }))")
  ]),

  exhibit("the values are not strictly deeply equal", () => {
    return equals<number | string>(7)("7")
  }).check([
    isInvalidMatchResult()
  ])

])