import { behavior } from "esbehavior"
import { equalTo, arrayContaining, objectWith, stringContaining } from "../src"
import { message, problem, value } from "../src/message"
import { exhibit, formattedList, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers"

export default behavior("objectWith", [

  exhibit("the object matches", () => {
    return objectWith({
      name: stringContaining("cool"),
      age: equalTo(27)
    })({ name: "cool dude", age: 27 })
  }).check([
    isValidMatchResult(),
    hasActual({name: value("cool dude"), age: value(27) }),
    hasExpected({
      name: message`a string that contains \"cool\"`,
      age: message`a number that equals 27`
    })
  ]),

  exhibit("one of the properties fails to match", () => {
    return objectWith({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining(stringContaining("tennis"))
    })({ name: "cool dude", age: 20, sport: [ "tennis" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("One of the object's properties was unexpected."),
    hasActual({name: value("cool dude"), age: problem(20), sport: value([ "tennis" ]) }),
    hasExpected({
      name: message`a string that contains \"cool\"`,
      age: problem(message`a number that equals 27`),
      sport: message`an array that contains a string that contains \"tennis\"`
    })
  ]),

  exhibit("several properties fail to match", () => {
    return objectWith({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining(stringContaining("tennis"))
    })({ name: "bad dude", age: 27, sport: [ "bowling" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("Some of the object's properties were unexpected."),
    hasActual({name: problem("bad dude"), age: value(27), sport: problem([ "bowling" ]) }),
    hasExpected({
      name: problem(message`a string that contains \"cool\"`),
      age: message`a number that equals 27`,
      sport: problem(message`an array that contains a string that contains \"tennis\"`)
    })
  ]),

  exhibit("the object does not have one of the specified properties", () => {
    return objectWith({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining(stringContaining("tennis"))
    })({ name: "cool dude", sport: [ "tennis" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have one of the expected properties."),
    hasInvalidActual({name: "cool dude", sport: [ "tennis" ] }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["\"name\"", "error(\"age\")", "\"sport\""])})`)
  ]),

  exhibit("the object does not have several of the specified properties", () => {
    return objectWith({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining(stringContaining("tennis"))
    })({ name: "cool dude" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have several of the expected properties."),
    hasInvalidActual({name: "cool dude" }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["\"name\"", "error(\"age\")", "error(\"sport\")"])})`)
  ])

])
