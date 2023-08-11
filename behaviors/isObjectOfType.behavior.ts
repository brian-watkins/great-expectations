import { behavior } from "esbehavior";
import { exhibit, hasActualMessageText, hasExpectedMessageText, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { objectOfType } from "../src";

export default behavior("is objectOfType", [

  exhibit("the object instantiates the expected type", () => {
    return objectOfType(FunnyClass)(new FunnyClass())
  }).check([
    isValidMatchResult(),
    hasActualMessageText("info(an object of type FunnyClass)"),
    hasExpectedMessageText("info(an object of type FunnyClass)")
  ]),

  exhibit("the object does not instantiate the expected type", () => {
    return objectOfType(SadClass)(new FunnyClass())
  }).check([
    isInvalidMatchResult(),
    hasActualMessageText("error(info(an object of type FunnyClass))"),
    hasExpectedMessageText("error(info(an object of type SadClass))")
  ]),

  exhibit("the actual is not an object", () => {
    return objectOfType(SadClass)(13)
  }).check([
    isInvalidMatchResult(),
    hasActualMessageText("error(info(an object of type Number))"),
    hasExpectedMessageText("error(info(an object of type SadClass))")
  ]),

])

class SadClass { }

class FunnyClass { }