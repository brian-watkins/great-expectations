import { behavior } from "esbehavior";
import { equalTo, mapWith } from "../src";
import { exhibit, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { anyValue, message, problem } from "../src/message";

export default behavior("isMapWith", [

  exhibit("the map contains the expected key", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("fun-key", "cool stuff")

    return mapWith([
      { key: equalTo("fun-key") }
    ])(actualMap)
  }).check([
    isValidMatchResult(),
    hasActual(new Map([["fun-key", "cool stuff"]])),
    hasExpected(new Map([ [ message`a string that equals "fun-key"`, anyValue() ] ]))
  ]),

  exhibit("the map contains the expected key with the expected value", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("fun-key", "cool stuff")

    return mapWith([
      { key: equalTo("fun-key"), value: equalTo("cool stuff") }
    ])(actualMap)
  }).check([
    isValidMatchResult(),
    hasActual(new Map([["fun-key", "cool stuff"]])),
    hasExpected(new Map([
      [ message`a string that equals "fun-key"`, message`a string that equals "cool stuff"`]
    ]))
  ]),

  exhibit("the map does not contain the expected key", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("awesome-key", "cool stuff")

    return mapWith([
      { key: equalTo("fun-key") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not contain the expected entries."),
    hasInvalidActual(new Map([["awesome-key", "cool stuff"]])),
    hasExpected(new Map([
      [ problem(message`a string that equals "fun-key"`), anyValue() ]
    ]))
  ]),

  exhibit("the map does not contain the expected value for a matching key", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("awesome-key", "cool stuff")

    return mapWith([
      { key: equalTo("awesome-key"), value: equalTo("rad stuff") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not contain the expected entries."),
    hasInvalidActual(new Map([["awesome-key", "cool stuff"]])),
    hasExpected(new Map([
      [ message`a string that equals "awesome-key"`, problem(message`a string that equals "rad stuff"`) ]
    ]))
  ]),

  exhibit("the map does not contain any entries, but one is expected", () => {
    const actualMap = new Map<string, string>()

    return mapWith([
      { key: equalTo("fun-key") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map is empty."),
    hasInvalidActual(new Map()),
    hasExpectedMessageText(`info(a map with at least 1 entry)`)
  ]),

  exhibit("the map does not contain any entries, but many are expected", () => {
    const actualMap = new Map<string, string>()

    return mapWith([
      { key: equalTo("fun-key") },
      { key: equalTo("another-key") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map is empty."),
    hasInvalidActual(new Map()),
    hasExpectedMessageText(`info(a map with at least 2 entries)`)
  ]),

])