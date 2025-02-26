import { behavior } from "esbehavior";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { message, value, valueWhere } from "../src";

export default behavior("valueWhere", [

  exhibit("the actual satisfies the predicate", () => {
    return valueWhere<number>(x => x % 2 === 0, "is even")(22)
  }).check([
    isValidMatchResult(),
    hasActual(22),
    hasExpectedMessageText("info(a number that is even)")
  ]),

  exhibit("the actual does not satisfy the predicate", () => {
    return valueWhere<number>(x => x > 20, "is greater than 20")(18)
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(18),
    hasMessage("The value does not satisfy the predicate."),
    hasExpectedMessageText("error(info(a number that is greater than 20))")
  ]),

  exhibit("a different type of value", () => {
    return valueWhere<string>(x => x.length > 3, "has more than 3 characters")("hello")
  }).check([
    isValidMatchResult(),
    hasActual("hello"),
    hasExpectedMessageText("info(a string that has more than 3 characters)")
  ]),

  exhibit("a description that's a message", () => {
    return valueWhere<string>(x => x > "something", message`is ordered after ${value("something")}`)("hello")
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual("hello"),
    hasExpectedMessageText(`error(info(a string that is ordered after "something"))`)
  ])


])