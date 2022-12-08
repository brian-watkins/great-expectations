import { behavior } from "esbehavior";
import { stringify } from "../src/stringify";
import { exhibit, property, testFormatter } from "./helpers";
import { strict as assert } from "node:assert"
import { actualValue, description, expectedValue, invalidActualValue, unsatisfiedExpectedValue } from "../src/matcher";

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
        assert.deepEqual(result, "[ 1\n, 2\n, 3\n]")
      })
    ]),

  exhibit("stringify an object", () => stringify({ name: "Cool Dude", count: 47 }))
    .check([
      property("it prints the stringified properties", (result) => {
        assert.deepEqual(result, "{\n  name: \"Cool Dude\",\n  count: 47\n}")
      })
    ]),

  exhibit("stringify an object with an expected message", () => {
    return stringify({ name: "something", message: description("some message") }, testFormatter)
  }).check([
    property("it recursively prints the message with the given formatter", (result) => {
      assert.deepEqual(result, "{\n  name: \"something\",\n  message: <some message>\n}")
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
        assert.deepEqual(result, "[ 1\n, 2\n, 3\n]")
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

  exhibit("stringify an expected message value", () => {
    return stringify(expectedValue(description("You failed!")), testFormatter)
  })
    .check([
      property("it prints the message", (result) => {
        assert.deepEqual(result, "<You failed!>")
      })
    ]),

  exhibit("stringify an unsatisfied expected message chain", () => {
    return stringify(unsatisfiedExpectedValue(description("First I did this, %expected%", description("Then I did this: %expected%", expectedValue(14)))), testFormatter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "green(<First I did this, Then I did this: 14>)")
    })
  ]),

  exhibit("stringify expected value with message that contains unsatisfied expected messages", () => {
    return stringify(expectedValue(description("Two things: (1) %expected% and (2) %expected%", expectedValue(description("a thing")), unsatisfiedExpectedValue(description("another thing")))), testFormatter)
  }).check([
    property("it prints the message with the proper formatting", (result) => {
      assert.deepEqual(result, "<Two things: (1) a thing and (2) green(another thing)>")
    })
  ]),

  exhibit("stringify an actual value", () => {
    return stringify(actualValue("OK"))
  }).check([
    property("it prints the value", (result) => {
      assert.deepEqual(result, "\"OK\"")
    })
  ]),

  exhibit("stringify actual value message", () => {
    return stringify(actualValue(description("Message")), testFormatter)
  }).check([
    property("it recursively prints the value with the given formatter", (result) => {
      assert.deepEqual(result, "<Message>")
    })
  ]),

  exhibit("stringify an invalid actual value", () => {
    return stringify(invalidActualValue("WRONG"), testFormatter)
  }).check([
    property("it prints the value", (result) => {
      assert.deepEqual(result, "red(\"WRONG\")")
    })
  ]),

  exhibit("stringify an invalid actual value message", () => {
    return stringify(invalidActualValue(description("some message")), testFormatter)
  }).check([
    property("it prints the value", (result) => {
      assert.deepEqual(result, "red(<some message>)")
    })
  ])

])
