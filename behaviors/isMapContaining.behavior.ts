import { behavior } from "esbehavior";
import { exhibit, hasActual, hasExpectedMessageText, hasInvalidActual, hasMatcherDescription, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { equalTo, mapContaining, stringContaining } from "../src";

export default behavior("isMapContaining", [

  exhibit("mapContaining key", () => {
    return mapContaining<string, string>({
      key: stringContaining("fun")
    })
  }).check([
    hasMatcherDescription("info(a map that contains the entry { a string that contains \"fun\" => <ANY> })")
  ]),

  exhibit("mapContaining key and value", () => {
    return mapContaining<string, string>({
      key: stringContaining("fun"),
      value: equalTo("stuff")
    })
  }).check([
    hasMatcherDescription("info(a map that contains the entry { a string that contains \"fun\" => a string that equals \"stuff\" })")
  ]),

  exhibit("the map contains the expected key", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("fun-key", "cool stuff")

    return mapContaining({
      key: equalTo("fun-key")
    })(actualMap)
  }).check([
    isValidMatchResult(),
    hasActual(new Map([["fun-key", "cool stuff"]])),
    hasExpectedMessageText(`info(a map that contains the entry { a string that equals "fun-key" => <ANY> })`)
  ]),

  exhibit("a readonly map contains the expected key", () => {
    const actualMap: ReadonlyMap<string, string> = new Map([["fun-key", "cool stuff"]])

    return mapContaining({
      key: equalTo("fun-key")
    })(actualMap)
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the map contains the expected key and value", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("happy-key", "cool stuff")

    return mapContaining<string, string>({
      key: equalTo("happy-key"),
      value: stringContaining("cool")
    })(actualMap)
  }).check([
    isValidMatchResult(),
    hasActual(new Map([["happy-key", "cool stuff"]])),
    hasExpectedMessageText(`info(a map that contains the entry { a string that equals "happy-key" => a string that contains "cool" })`)
  ]),

  exhibit("the map does not contain the expected key", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("fun-key", "cool stuff")
    actualMap.set("super-key", "super stuff")

    return mapContaining({
      key: equalTo("weird-key")
    })(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not contain the expected entry."),
    hasInvalidActual(new Map([["fun-key", "cool stuff"], ["super-key", "super stuff"]])),
    hasExpectedMessageText(`info(a map that contains the entry { error(a string that equals "weird-key") => <ANY> })`)
  ]),

  exhibit("the map does not contain the expected value for the expected key", () => {
    const actualMap = new Map<string, string>()
    actualMap.set("fun-key", "cool stuff")
    actualMap.set("super-key", "super stuff")

    return mapContaining<string, string>({
      key: equalTo("super-key"),
      value: stringContaining("weird")
    })(actualMap)
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not contain the expected entry."),
    hasInvalidActual(new Map([["fun-key", "cool stuff"], ["super-key", "super stuff"]])),
    hasExpectedMessageText(`info(a map that contains the entry { a string that equals "super-key" => error(a string that contains "weird") })`)
  ]),

  exhibit("the map is empty", () => {
    return mapContaining<string, string>({
      key: equalTo("super-key"),
      value: stringContaining("weird")
    })(new Map())
  }).check([
    isInvalidMatchResult(),
    hasMessage("The map does not contain the expected entry."),
    hasInvalidActual(new Map()),
    hasExpectedMessageText(`error(info(a map that contains the entry { a string that equals "super-key" => a string that contains "weird" }))`)
  ]),
])