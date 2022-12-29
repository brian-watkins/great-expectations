import { behavior } from "esbehavior"
import { equals, isObjectWithProperty, isStringContaining } from "../src"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

const symbol = Symbol("fun-stuff")

export default behavior("isObjectWithProperty", [

  exhibit("the object has a property that matches", () => {
    return isObjectWithProperty("name", isStringContaining("cool"))({ name: "cool dude" })
  }).check([
    isValidMatchResult(),
    hasActual({name: "cool dude"}),
    hasExpectedMessageText("info(an object with a property \"name\" that is a string that contains \"cool\")")
  ]),

  exhibit("the object has a property that does not match", () => {
    return isObjectWithProperty("name", isStringContaining("cool"))({ name: "someone else" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The value at the specified property is unexpected."),
    hasInvalidActual({name: "someone else"}),
    hasExpectedMessageText("error(info(an object with a property \"name\" that is a string that contains \"cool\"))")
  ]),

  exhibit("the object does not have the specified property", () => {
    return isObjectWithProperty("blah", equals(27))({ name: "cool dude" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have the expected property."),
    hasInvalidActual({name: "cool dude"}),
    hasExpectedMessageText("error(info(an object with a property \"blah\"))")
  ]), 

  exhibit("the specified property name is a symbol", () => {
    return isObjectWithProperty(symbol, equals(27))({ [symbol]: 27 })
  }).check([
    isValidMatchResult(),
    hasActual({ [symbol]: 27 }),
    hasExpectedMessageText("info(an object with a property <SYMBOL(fun-stuff)> that is a number that equals 27)")
  ]),

  exhibit("the specified property name is a number", () => {
    return isObjectWithProperty(14, equals(8))({ 14: 8 })
  }).check([
    isValidMatchResult(),
    hasActual({ 14: 8 }),
    hasExpectedMessageText("info(an object with a property 14 that is a number that equals 8)")
  ])

])

