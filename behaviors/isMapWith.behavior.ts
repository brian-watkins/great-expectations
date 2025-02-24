import { behavior } from "esbehavior";
import { equalTo, mapWith, stringContaining } from "../src";
import { exhibit, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { Message, Problem, Value, anyValue, message, problem } from "../src/message";

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
    hasMessage("The map does not match the expected entries."),
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
    hasMessage("The map does not match the expected entries."),
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
    hasExpectedMessageText(`error(info(a map with 1 entry))`)
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
    hasExpectedMessageText(`error(info(a map with 2 entries))`)
  ]),

  exhibit("the map contains one expected entry, but others", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("blah", "blah")
    actualMap.set("fun", "fun")

    return mapWith([
      { key: equalTo("blah") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not match the expected entries."),
    hasInvalidActual(new Map([["blah", "blah"], ["fun", "fun"]])),
    hasExpectedMessageText("error(info(a map with only 1 entry))")
  ]),

  exhibit("the map contains many expected entries", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("blah", "blah")
    actualMap.set("fun", "fun")
    actualMap.set("awesome", "awesome")

    return mapWith([
      { key: equalTo("blah") },
      { key: equalTo("awesome") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not match the expected entries."),
    hasInvalidActual(new Map([["blah", "blah"], ["fun", "fun"], ["awesome", "awesome"]])),
    hasExpectedMessageText("error(info(a map with only 2 entries))")
  ]),

  exhibit("the map contains the wrong number of entries and an entry that matches several entry matchers", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("blah", "blah")

    return mapWith<string, string>([
      { key: equalTo("blah") },
      { key: stringContaining("b") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not match the expected entries."),
    hasInvalidActual(new Map([["blah", "blah"]])),
    hasExpectedMessageText("error(info(a map with 2 entries))")
  ]),

  exhibit("the map contains the correct number of entries but has an entry that matches several entry matchers", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("blah", "blah")
    actualMap.set("cat", "cat")

    return mapWith<string, string>([
      { key: equalTo("blah") },
      { key: stringContaining("b") }
    ])(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not match the expected entries."),
    hasInvalidActual(new Map([["blah", "blah"], ["cat", "cat"]])),
    hasExpected(new Map<Problem | Message, Value>([
      [ message`a string that equals "blah"`, anyValue() ],
      [ problem(message`a string that contains "b"`), anyValue() ]
    ]))
  ]),

  exhibit("the map contains no entries and no entries are expected", () => {
    return mapWith([])(new Map())
  }).check([
    isValidMatchResult(),
    hasActual(new Map()),
    hasExpected(new Map())
  ])

])
