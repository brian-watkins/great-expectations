import { behavior } from "esbehavior"
import { equals, isArrayContaining, isObjectWhere, isStringContaining } from "../src"
import { description, problem } from "../src/matcher"
import { exhibit, formattedList, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("isObjectWhere", [

  exhibit("the object matches", () => {
    return isObjectWhere({
      name: isStringContaining("cool"),
      age: equals(27)
    })({ name: "cool dude", age: 27 })
  }).check([
    isValidMatchResult(),
    hasActual({name: "cool dude", age: 27 }),
    hasExpected({
      name: description("a string that contains \"cool\""),
      age: description("a number that equals 27")
    })
  ]),

  exhibit("one of the properties fails to match", () => {
    return isObjectWhere({
      name: isStringContaining("cool"),
      age: equals(27),
      sport: isArrayContaining(isStringContaining("tennis"))
    })({ name: "cool dude", age: 20, sport: [ "tennis" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("One of the object's properties was unexpected."),
    hasActual({name: "cool dude", age: problem(20), sport: [ "tennis" ] }),
    hasExpected({
      name: description("a string that contains \"cool\""),
      age: problem(description("a number that equals 27")),
      sport: description("an array that contains a string that contains \"tennis\"")
    })
  ]),

  exhibit("several properties fail to match", () => {
    return isObjectWhere({
      name: isStringContaining("cool"),
      age: equals(27),
      sport: isArrayContaining(isStringContaining("tennis"))
    })({ name: "bad dude", age: 27, sport: [ "bowling" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("Some of the object's properties were unexpected."),
    hasActual({name: problem("bad dude"), age: 27, sport: problem([ "bowling" ]) }),
    hasExpected({
      name: problem(description("a string that contains \"cool\"")),
      age: description("a number that equals 27"),
      sport: problem(description("an array that contains a string that contains \"tennis\""))
    })
  ]),

  exhibit("the object does not have one of the specified properties", () => {
    return isObjectWhere({
      name: isStringContaining("cool"),
      age: equals(27),
      sport: isArrayContaining(isStringContaining("tennis"))
    })({ name: "cool dude", sport: [ "tennis" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have one of the expected properties."),
    hasInvalidActual({name: "cool dude", sport: [ "tennis" ] }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["\"name\"", "error(\"age\")", "\"sport\""])})`)
  ]),

  exhibit("the object does not have several of the specified properties", () => {
    return isObjectWhere({
      name: isStringContaining("cool"),
      age: equals(27),
      sport: isArrayContaining(isStringContaining("tennis"))
    })({ name: "cool dude" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have several of the expected properties."),
    hasInvalidActual({name: "cool dude" }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["\"name\"", "error(\"age\")", "error(\"sport\")"])})`)
  ])

])
