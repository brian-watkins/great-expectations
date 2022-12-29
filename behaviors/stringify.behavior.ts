import { behavior } from "esbehavior";
import { stringify } from "../src/stringify";
import { exhibit, property, testFormatter } from "./helpers";
import { strict as assert } from "node:assert"
import { description, list, problem } from "../src/matcher";

export default behavior("stringify", [

  exhibit("stringify a string", () => stringify("hello", testFormatter))
    .check([
      property("it surrounds the string with quotes", (result) => {
        assert.deepEqual(result, "\"hello\"")
      })
    ]),

  exhibit("stringify a number", () => stringify(32, testFormatter))
    .check([
      property("it simply prints the number", (result) => {
        assert.deepEqual(result, "32")
      })
    ]),

  exhibit("stringify a bigint", () => stringify(BigInt("234452"), testFormatter))
    .check([
      property("it simply prints the number", (result) => {
        assert.deepEqual(result, "234452")
      })
    ]),

  exhibit("stringify a true value", () => stringify(true, testFormatter))
    .check([
      property("it prints the boolean value", (result) => {
        assert.deepEqual(result, "<TRUE>")
      })
    ]),

  exhibit("stringify a false value", () => stringify(false, testFormatter))
    .check([
      property("it prints the boolean value", (result) => {
        assert.deepEqual(result, "<FALSE>")
      })
    ]),

  exhibit("stringify an undefined value", () => stringify(undefined, testFormatter))
    .check([
      property("it prints undefined", (result) => {
        assert.deepEqual(result, "<UNDEFINED>")
      })
    ]),

  exhibit("stringify a null value", () => stringify(null, testFormatter))
    .check([
      property("it prints null", (result) => {
        assert.deepEqual(result, "<NULL>")
      })
    ]),

  exhibit("stringify a function", () => stringify(function () { console.log("HEY!"); }, testFormatter))
    .check([
      property("it prints the function word", (result) => {
        assert.deepEqual(result, "<FUNCTION>")
      })
    ]),

  exhibit("stringify a symbol", () => stringify(Symbol("my-symbol"), testFormatter))
    .check([
      property("it prints the symbol", (result) => {
        assert.deepEqual(result, "<SYMBOL(my-symbol)>")
      })
    ]),

  exhibit("stringify a symbol with no description", () => stringify(Symbol(), testFormatter))
    .check([
      property("it prints the symbol", (result) => {
        assert.deepEqual(result, "<SYMBOL()>")
      })
    ]),

  exhibit("stringify an array", () => stringify([1, 2, 3], testFormatter))
    .check([
      property("it prints the stringified elements", (result) => {
        assert.deepEqual(result, "[\n  1,\n  2,\n  3,\n]")
      })
    ]),

  exhibit("stringify an object", () => stringify({ name: "Cool Dude", count: 47 }, testFormatter))
    .check([
      property("it prints the stringified properties", (result) => {
        assert.deepEqual(result, "{ name: \"Cool Dude\", count: 47 }")
      })
    ]),

  exhibit("stringify an object with a description", () => {
    return stringify({ name: "something", message: description("some message") }, testFormatter)
  }).check([
    property("it recursively prints the message with the given formatter", (result) => {
      assert.deepEqual(result, "{ name: \"something\", message: info(some message) }")
    })
  ]),

  exhibit("stringify a problem value", () => {
    return stringify(problem("Whoops"), testFormatter)
  })
    .check([
      property("it prints the problematic value", (result) => {
        assert.deepEqual(result, "error(\"Whoops\")")
      })
    ]),

  exhibit("stringify a description", () => {
    return stringify(description("You failed!"), testFormatter)
  })
    .check([
      property("it prints the message", (result) => {
        assert.deepEqual(result, "info(You failed!)")
      })
    ]),

  exhibit("stringify an problematic description chain", () => {
    return stringify(problem(description("First I did this, %expected%", description("Then I did this: %expected%", problem(14)))), testFormatter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "error(info(First I did this, Then I did this: 14))")
    })
  ]),

  exhibit("stringify description with message that contains problematic descriptions", () => {
    return stringify(description("Two things: (1) %expected% and (2) %expected%", description("a thing"), problem(description("another thing"))), testFormatter)
  }).check([
    property("it prints the message with the proper formatting", (result) => {
      assert.deepEqual(result, "info(Two things: (1) a thing and (2) error(another thing))")
    })
  ]),

  exhibit("stringify object with circular reference", () => {
    const myObject: any = { name: "cool dude", subobject: {} }
    myObject.subobject.ref = myObject
    return stringify(myObject, testFormatter)
  }).check([
    property("it prints the object without any problem", (result) => {
      assert.deepEqual(result, "{ name: \"cool dude\", subobject: { ref: <CIRCULAR> } }")
    })
  ]),

  exhibit("stringify array with circular reference", () => {
    const myArray: Array<any> = [ { name: "fun person" }, { name: "cool dude" } ]
    myArray[2] = myArray
    return stringify(myArray, testFormatter)
  }).check([
    property("it prints the array without any problem", (result) => {
      assert.deepEqual(result, "[\n  { name: \"fun person\" },\n  { name: \"cool dude\" },\n  <CIRCULAR>,\n]")
    })
  ]),

  exhibit("stringify list", () => {
    return stringify(list([1, problem(2), 3, 4]), testFormatter)
  }).check([
    property("it prints the list", (result) => {
      assert.deepEqual(result, "\n  • 1\n  • error(2)\n  • 3\n  • 4")
    })
  ])

])
