import { behavior } from "esbehavior";
import { equalTo } from "../src";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("equals", [

  exhibit("the values are deeply equal", () => {
    return equalTo({ name: "cool dude" })({ name: "cool dude" })
  }).check([
    isValidMatchResult(),
    hasActual({name: "cool dude"}),
    hasExpectedMessageText("info(an object that equals { name: \"cool dude\" })")
  ]),

  exhibit("the values are not deeply equal", () => {
    return equalTo({ name: "cool dude", count: 7 })({ name: "cool dude", count: 5 })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The actual value is not equal to the expected value."),
    hasInvalidActual({ name: "cool dude", count: 5 }),
    hasExpectedMessageText("error(info(an object that equals { name: \"cool dude\", count: 7 }))")
  ]),

  exhibit("the values are not strictly deeply equal", () => {
    return equalTo<number | string>(7)("7")
  }).check([
    isInvalidMatchResult()
  ])

])