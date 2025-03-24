import { behavior } from "esbehavior"
import { equalTo, arrayContaining, objectWith, stringContaining } from "../src/index.js"
import { message, problem, value } from "../src/message.js"
import { exhibit, formattedList, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js"

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

  exhibit("the object matches a subset of properties", () => {
    return objectWith<{ name: string, age: number }>({
      name: stringContaining("cool"),
    })({ name: "cool dude", age: 27 })
  }).check([
    isValidMatchResult(),
    hasActual({name: value("cool dude"), age: value(27) }),
    hasExpected({
      name: message`a string that contains \"cool\"`,
    })
  ]),

  exhibit("one of the properties fails to match", () => {
    return objectWith<{ name: string, age: number, sport: Array<string> }>({
      age: equalTo(27),
      sport: arrayContaining<string>(stringContaining("tennis"))
    })({ name: "cool dude", age: 20, sport: [ "tennis" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("One of the object's properties was unexpected."),
    hasActual({name: value("cool dude"), age: problem(20), sport: value([ "tennis" ]) }),
    hasExpected({
      age: problem(message`a number that equals 27`),
      sport: message`an array that contains a string that contains \"tennis\"`
    })
  ]),

  exhibit("several properties fail to match", () => {
    return objectWith({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining<string>(stringContaining("tennis"))
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
    return objectWith<any>({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining<string>(stringContaining("tennis"))
    })({ name: "cool dude", sport: [ "tennis" ] })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have one of the expected properties."),
    hasInvalidActual({name: "cool dude", sport: [ "tennis" ] }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["\"name\"", "error(\"age\")", "\"sport\""])})`)
  ]),

  exhibit("the object does not have several of the specified properties", () => {
    return objectWith<any>({
      name: stringContaining("cool"),
      age: equalTo(27),
      sport: arrayContaining<string>(stringContaining("tennis"))
    })({ name: "cool dude" })
  }).check([
    isInvalidMatchResult(),
    hasMessage("The object does not have several of the expected properties."),
    hasInvalidActual({name: "cool dude" }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["\"name\"", "error(\"age\")", "error(\"sport\")"])})`)
  ]),

  exhibit("the object is a variant of a discriminated union", () => {
    return objectWith<TestEvent, TestDeleteEvent>({
      id: stringContaining("blue"),
    })({ type: "delete", id: "blue-123" })
  }).check([
    isValidMatchResult(),
    hasActual({ type: value("delete"), id: value("blue-123") }),
    hasExpected({
      id: message`a string that contains \"blue\"`
    })
  ]),

  exhibit("the actual is the wrong variant of a discriminated union", () => {
    return objectWith<TestEvent, TestDeleteEvent>({
      id: stringContaining("blue"),
    })({ type: "create", color: "blue", name: "stuff" })
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual({ type: "create", color: "blue", name: "stuff" }),
    hasExpectedMessageText(`info(an object that contains properties: ${formattedList(["error(\"id\")"])})`)
  ]),

  exhibit("the object is a variant of a discriminated union and the actual does not match", () => {
    return objectWith<TestEvent, TestCreateEvent>({
      color: stringContaining("blue"),
      name: stringContaining("fun")
    })({ type: "create", name: "awesome", color: "blue-green" })
  }).check([
    isInvalidMatchResult(),
    hasActual({ type: value("create"), name: problem("awesome"), color: value("blue-green") }),
    hasExpected({
      color: message`a string that contains \"blue\"`,
      name: problem(message`a string that contains \"fun\"`)
    })
  ]),

])


interface TestCreateEvent {
  type: "create"
  name: string
  color: string
}

interface TestReadEvent {
  type: "read"
  query: string
  requested: number
}

interface TestDeleteEvent {
  type: "delete"
  id: string
}

type TestEvent = TestCreateEvent | TestDeleteEvent | TestReadEvent
