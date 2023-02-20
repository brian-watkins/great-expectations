import { behavior } from "esbehavior"
import { equalTo, objectWithProperty, stringContaining } from "../src/index.js"
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js"

const symbol = Symbol("fun-stuff")

export default behavior("isObjectWithProperty", [

  exhibit("the object has a property that matches", () => {
    return objectWithProperty("name", stringContaining("cool"))({ name: "cool dude" })
  }).check([
    isValidMatchResult(),
    hasActual({name: "cool dude"}),
    hasExpectedMessageText("info(an object with a property \"name\" that is a string that contains \"cool\")")
  ]),

  exhibit("the object has a property that does not match", () => {
    return objectWithProperty("name", stringContaining("cool"))({ name: "someone else" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The value at the specified property is unexpected."),
    hasInvalidActual({name: "someone else"}),
    hasExpectedMessageText("error(info(an object with a property \"name\" that is a string that contains \"cool\"))")
  ]),

  exhibit("the object does not have the specified property", () => {
    return objectWithProperty("blah", equalTo(27))({ name: "cool dude" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have the expected property."),
    hasInvalidActual({name: "cool dude"}),
    hasExpectedMessageText("error(info(an object with a property \"blah\"))")
  ]), 

  exhibit("the specified property name is a symbol", () => {
    return objectWithProperty(symbol, equalTo(27))({ [symbol]: 27 })
  }).check([
    isValidMatchResult(),
    hasActual({ [symbol]: 27 }),
    hasExpectedMessageText("info(an object with a property <SYMBOL(fun-stuff)> that is a number that equals 27)")
  ]),

  exhibit("the specified property name is a number", () => {
    return objectWithProperty(14, equalTo(8))({ 14: 8 })
  }).check([
    isValidMatchResult(),
    hasActual({ 14: 8 }),
    hasExpectedMessageText("info(an object with a property 14 that is a number that equals 8)")
  ])

])

