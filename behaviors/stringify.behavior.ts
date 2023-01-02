import { behavior } from "esbehavior";
import { stringify } from "../src/stringify";
import { exhibit, property, testFormatter } from "./helpers";
import { strict as assert } from "node:assert"
import { list, message, problem, times, typeName, value } from "../src/message";

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
        assert.deepEqual(result, "[\n  1,\n  2,\n  3\n]")
      })
    ]),

  exhibit("stringify an object", () => stringify({ name: "Cool Dude", count: 47 }, testFormatter))
    .check([
      property("it prints the stringified properties", (result) => {
        assert.deepEqual(result, "{\n  name: \"Cool Dude\",\n  count: 47\n}")
      })
    ]),

  exhibit("stringify an object with a message", () => {
    return stringify({ name: "something", message: message`some message` }, testFormatter)
  }).check([
    property("it recursively prints the message with the given formatter", (result) => {
      assert.deepEqual(result, "{\n  name: \"something\",\n  message: info(some message)\n}")
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

  exhibit("stringify an problematic message chain", () => {
    return stringify(problem(message`First I did this, ${message`Then I did this: ${problem(14)}`}`), testFormatter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "error(info(First I did this, Then I did this: 14))")
    })
  ]),

  exhibit("stringify message that contains problematic descriptions", () => {
    return stringify(message`Two things: (1) ${message`a thing`} and (2) ${problem(message`another thing`)}`, testFormatter)
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
      assert.deepEqual(result, "{\n  name: \"cool dude\",\n  subobject: {\n    ref: <CIRCULAR>\n  }\n}")
    })
  ]),

  exhibit("stringify array with circular reference", () => {
    const myArray: Array<any> = [ { name: "fun person" }, { name: "cool dude" } ]
    myArray[2] = myArray
    return stringify(myArray, testFormatter)
  }).check([
    property("it prints the array without any problem", (result) => {
      assert.deepEqual(result, "[\n  {\n    name: \"fun person\"\n  },\n  {\n    name: \"cool dude\"\n  },\n  <CIRCULAR>\n]")
    })
  ]),

  exhibit("stringify list", () => {
    return stringify(list([1, problem(2), 3, 4]), testFormatter)
  }).check([
    property("it prints the list", (result) => {
      assert.deepEqual(result, "\n  • 1\n  • error(2)\n  • 3\n  • 4")
    })
  ]),

  exhibit("stringify message", () => {
    return stringify(message`This is something ${value("cool")}: ${value(27)} and other stuff.`, testFormatter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "info(This is something \"cool\": 27 and other stuff.)")
    })
  ]),

  exhibit("stringify message with a generated string", () => {
    return stringify(message`This is ${"something"}.`, testFormatter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "info(This is something.)")
    })
  ]),

  exhibit("stringify the type names", () => {
    return stringify(message`${typeName(true)}, ${typeName("hello")}, ${typeName(1)}, ${typeName({foo: "bar"})}, ${typeName(() => {})}, ${typeName(Symbol("fun"))}, ${typeName(BigInt("234452"))}, ${typeName(undefined)}`, testFormatter)
  }).check([
    property("it prints the type name", (result) => {
      assert.deepEqual(result, "info(a boolean, a string, a number, an object, a function, a symbol, a bigint, undefined)")
    })
  ]),

  exhibit("stringify a times message", () => {
    return stringify(message`${times(0)}, ${times(1)}, ${times(5)}`, testFormatter)
  }).check([
    property("it prints the times messages", (result) => {
      assert.deepEqual(result, "info(exactly 0 times, exactly 1 time, exactly 5 times)")
    })
  ]),

  exhibit("stringify an array with nested lists", () => {
    return stringify([
      message`hello`,
      message`a value that satisfies:${list([
        message`one`,
        message`another list${list([
          message`two ${problem("bad")}`,
          message`three`
        ])}`
      ])}`,
      message`goodbye`
    ], testFormatter)
  }).check([
    property("it indents the lists properly", (result) => {
      assert.deepEqual(result, `[
  info(hello),
  info(a value that satisfies:
    • one
    • another list
      • two error("bad")
      • three),
  info(goodbye)
]`)
    })
  ]),

  exhibit("stringify an object with nested objects and arrays", () => {
    return stringify({
      name: message`${value("cool dude")}`,
      sports: [
        message`one`,
        message`satisfying:${list([
          message`contains ${value("bowling")}`
        ])}`
      ],
      address: {
        street: message`road`,
        zip: message`11111`
      },
      interests: problem(list([
        message`hello`,
        message`yo yo`
      ]))
    }, testFormatter)
  }).check([
    property("it indents the object properly", (result) => {
      assert.deepEqual(result, `{
  name: info(\"cool dude\"),
  sports: [
    info(one),
    info(satisfying:
      • contains \"bowling\")
  ],
  address: {
    street: info(road),
    zip: info(11111)
  },
  interests: error(
    • info(hello)
    • info(yo yo))
}`)
    })
  ]),

  exhibit("stringify a value with proper indentation", () => {
    return stringify({
      name: message`hello`,
      stuff: value({
        count: problem(7)
      })
    }, testFormatter)
  }).check([
    property("it indents properly", (result) => {
      assert.deepEqual(result, `{
  name: info(hello),
  stuff: {
    count: error(7)
  }
}`)
    })
  ])

])
