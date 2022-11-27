import { behavior } from "esbehavior";
import { stringify } from "../src/stringify";
import { exhibit, property } from "./helpers";
import { strict as assert } from "node:assert"
import { actualValue, expectedMessage, expectedValue, invalidActualValue, unsatisfiedExpectedValue } from "../src/matcher";
import { Formatter } from "../src/formatter";

export default behavior("stringify", [

  exhibit("stringify a string", () => stringify("hello"))
    .check([
      property("it surrounds the string with quotes", (result) => {
        assert.deepEqual(result, "\"hello\"")
      })
    ]),

  exhibit("stringify a number", () => stringify(32))
    .check([
      property("it simply prints the number", (result) => {
        assert.deepEqual(result, "32")
      })
    ]),

  exhibit("stringify a bigint", () => stringify(BigInt("234452")))
    .check([
      property("it simply prints the number", (result) => {
        assert.deepEqual(result, "234452")
      })
    ]),

  exhibit("stringify a true value", () => stringify(true))
    .check([
      property("it prints the boolean value", (result) => {
        assert.deepEqual(result, "<TRUE>")
      })
    ]),

  exhibit("stringify a false value", () => stringify(false))
    .check([
      property("it prints the boolean value", (result) => {
        assert.deepEqual(result, "<FALSE>")
      })
    ]),

  exhibit("stringify an undefined value", () => stringify(undefined))
    .check([
      property("it prints undefined", (result) => {
        assert.deepEqual(result, "<UNDEFINED>")
      })
    ]),

  exhibit("stringify a null value", () => stringify(null))
    .check([
      property("it prints null", (result) => {
        assert.deepEqual(result, "<NULL>")
      })
    ]),

  exhibit("stringify a function", () => stringify(function () { console.log("HEY!"); }))
    .check([
      property("it prints the function word", (result) => {
        assert.deepEqual(result, "<FUNCTION>")
      })
    ]),

  exhibit("stringify a symbol", () => stringify(Symbol("my-symbol")))
    .check([
      property("it prints the symbol", (result) => {
        assert.deepEqual(result, "<SYMBOL(my-symbol)>")
      })
    ]),

  exhibit("stringify a symbol with no description", () => stringify(Symbol()))
    .check([
      property("it prints the symbol", (result) => {
        assert.deepEqual(result, "<SYMBOL()>")
      })
    ]),

  exhibit("stringify an array", () => stringify([1, 2, 3]))
    .check([
      property("it prints the stringified elements", (result) => {
        assert.deepEqual(result, "[ 1,\n  2,\n  3 ]")
      })
    ]),

  exhibit("stringify an object", () => stringify({ name: "Cool Dude", count: 47 }))
    .check([
      property("it prints the stringified properties", (result) => {
        assert.deepEqual(result, "{\n  name: \"Cool Dude\",\n  count: 47\n}")
      })
    ]),

  exhibit("stringify a nested expected value", () => {
    return stringify(expectedValue([
      expectedValue(1),
      expectedValue(2),
      expectedValue(3)
    ]))
  })
    .check([
      property("it prints the expected values", (result) => {
        assert.deepEqual(result, "[ 1,\n  2,\n  3 ]")
      })
    ]),

  exhibit("stringify an unsatisfied expected value", () => {
    return stringify(unsatisfiedExpectedValue("Whoops"), testFormatter)
  })
    .check([
      property("it prints the unsatisfied expected value", (result) => {
        assert.deepEqual(result, "green(\"Whoops\")")
      })
    ]),

  exhibit("stringify an expected message", () => {
    return stringify(expectedMessage("You failed!"))
  })
    .check([
      property("it prints the message", (result) => {
        assert.deepEqual(result, "<You failed!>")
      })
    ]),

  exhibit("stringify an actual value", () => {
      return stringify(actualValue("OK"))
    })
      .check([
        property("it prints the value", (result) => {
          assert.deepEqual(result, "\"OK\"")
        })
      ]),

  exhibit("stringify an invalid actual value", () => {
    return stringify(invalidActualValue("WRONG"), testFormatter)
  })
    .check([
      property("it prints the value", (result) => {
        assert.deepEqual(result, "red(\"WRONG\")")
      })
    ])

])

const testFormatter: Formatter = {
  red: (message) => `red(${message})`,
  green: (message) => `green(${message})`
}