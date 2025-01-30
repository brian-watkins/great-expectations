import { behavior } from "esbehavior";
import { stringify } from "../src/stringify.js";
import { exhibit, property, testWriter } from "./helpers.js";
import { strict as assert } from "node:assert"
import { anyValue, list, message, problem, times, typeName, value } from "../src/message.js";

export default behavior("stringify", [

  exhibit("stringify an any value", () => stringify(anyValue(), testWriter))
    .check([
      property("it prints the any value", (result) => {
        assert.deepEqual(result, "<ANY>")
      })
    ]),

  exhibit("stringify a falsey value", () => stringify(value(0), testWriter))
    .check([
      property("it prints the value", (result) => {
        assert.deepEqual(result, "0")
      })
    ]),

  exhibit("stringify a string", () => stringify("hello", testWriter))
    .check([
      property("it surrounds the string with quotes", (result) => {
        assert.deepEqual(result, "\"hello\"")
      })
    ]),

  exhibit("stringify a number", () => stringify(32, testWriter))
    .check([
      property("it simply prints the number", (result) => {
        assert.deepEqual(result, "32")
      })
    ]),

  exhibit("stringify a bigint", () => stringify(BigInt("234452"), testWriter))
    .check([
      property("it simply prints the number", (result) => {
        assert.deepEqual(result, "234452")
      })
    ]),

  exhibit("stringify a true value", () => stringify(true, testWriter))
    .check([
      property("it prints the boolean value", (result) => {
        assert.deepEqual(result, "<TRUE>")
      })
    ]),

  exhibit("stringify a false value", () => stringify(false, testWriter))
    .check([
      property("it prints the boolean value", (result) => {
        assert.deepEqual(result, "<FALSE>")
      })
    ]),

  exhibit("stringify an undefined value", () => stringify(undefined, testWriter))
    .check([
      property("it prints undefined", (result) => {
        assert.deepEqual(result, "<UNDEFINED>")
      })
    ]),

  exhibit("stringify a null value", () => stringify(null, testWriter))
    .check([
      property("it prints null", (result) => {
        assert.deepEqual(result, "<NULL>")
      })
    ]),

  exhibit("stringify a function", () => stringify(function () { console.log("HEY!"); }, testWriter))
    .check([
      property("it prints the function word", (result) => {
        assert.deepEqual(result, "<FUNCTION>")
      })
    ]),

  exhibit("stringify a symbol", () => stringify(Symbol("my-symbol"), testWriter))
    .check([
      property("it prints the symbol", (result) => {
        assert.deepEqual(result, "<SYMBOL(my-symbol)>")
      })
    ]),

  exhibit("stringify a symbol with no description", () => stringify(Symbol(), testWriter))
    .check([
      property("it prints the symbol", (result) => {
        assert.deepEqual(result, "<SYMBOL()>")
      })
    ]),

  exhibit("stringify an array", () => stringify([1, 2, 3], testWriter))
    .check([
      property("it prints the stringified elements", (result) => {
        assert.deepEqual(result, "[\n  1,\n  2,\n  3\n]")
      })
    ]),

  exhibit("stringify an empty array", () => stringify([], testWriter))
    .check([
      property("it prints the stringified elements", (result) => {
        assert.deepEqual(result, "[]")
      })
    ]),

  exhibit("stringify a map", () => {
    const map = new Map<number, string>()
    map.set(27, "Fun stuff!")
    map.set(14, "Cool stuff!")
    map.set(31, "Happy stuff!")
    return stringify(map, testWriter)
  }).check([
    property("it prints the stringified map entries", (result) => {
      assert.deepEqual(result, `Map {\n  27 => "Fun stuff!",\n  14 => "Cool stuff!",\n  31 => "Happy stuff!"\n}`)
    })
  ]),

  exhibit("stringify a complicated map", () => {
    const map = new Map()
    map.set({ name: "cool person" }, [ "apple", "pear" ])
    map.set({ name: "funny person" }, [ "banana", "grapes" ])
    return stringify(map, testWriter)
  }).check([
    property("it prints the complicated map", (result) => {
      assert.deepEqual(result, `Map {\n  {\n    name: "cool person"\n  } => [\n    "apple",\n    "pear"\n  ],\n  {\n    name: "funny person"\n  } => [\n    "banana",\n    "grapes"\n  ]\n}`)
    })
  ]),

  exhibit("stringify an empty map", () => {
    return stringify(new Map(), testWriter)
  }).check([
    property("it prints the empty map", (result) => {
      assert.deepEqual(result, `Map {}`)
    })
  ]),

  exhibit("stringify an error", () => {
    return stringify(new Error("Hey I'm an error!"), testWriter)
  }).check([
    property("it prints the error message", (result) => {
      assert.deepEqual(result, "Error: Hey I'm an error!")
    })
  ]),

  exhibit("stringify an object", () => stringify({ name: "Cool Dude", count: 47 }, testWriter))
    .check([
      property("it prints the stringified properties", (result) => {
        assert.deepEqual(result, "{\n  name: \"Cool Dude\",\n  count: 47\n}")
      })
    ]),

  exhibit("stringify an empty object", () => stringify({}, testWriter))
    .check([
      property("it prints the stringified properties", (result) => {
        assert.deepEqual(result, "{}")
      })
    ]),

  exhibit("stringify an object with a message", () => {
    return stringify({ name: "something", message: message`some message` }, testWriter)
  }).check([
    property("it recursively prints the message with the given formatter", (result) => {
      assert.deepEqual(result, "{\n  name: \"something\",\n  message: info(some message)\n}")
    })
  ]),

  exhibit("stringify a problem value", () => {
    return stringify(problem("Whoops"), testWriter)
  })
    .check([
      property("it prints the problematic value", (result) => {
        assert.deepEqual(result, "error(\"Whoops\")")
      })
    ]),

  exhibit("stringify an problematic message chain", () => {
    return stringify(problem(message`First I did this, ${message`Then I did this: ${problem(14)}`}`), testWriter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "error(info(First I did this, Then I did this: 14))")
    })
  ]),

  exhibit("stringify message that contains problematic descriptions", () => {
    return stringify(message`Two things: (1) ${message`a thing`} and (2) ${problem(message`another thing`)}`, testWriter)
  }).check([
    property("it prints the message with the proper formatting", (result) => {
      assert.deepEqual(result, "info(Two things: (1) a thing and (2) error(another thing))")
    })
  ]),

  exhibit("stringify object with circular reference", () => {
    const myObject: any = { name: "cool dude", subobject: {} }
    myObject.subobject.ref = myObject
    return stringify(myObject, testWriter)
  }).check([
    property("it prints the object with a circular indicator", (result) => {
      assert.deepEqual(result, "{\n  name: \"cool dude\",\n  subobject: {\n    ref: <CIRCULAR>\n  }\n}")
    })
  ]),

  exhibit("stringify array with circular reference", () => {
    const myArray: Array<any> = [ { name: "fun person" }, { name: "cool dude" } ]
    myArray[2] = myArray
    return stringify(myArray, testWriter)
  }).check([
    property("it prints the array with a circular indicator", (result) => {
      assert.deepEqual(result, "[\n  {\n    name: \"fun person\"\n  },\n  {\n    name: \"cool dude\"\n  },\n  <CIRCULAR>\n]")
    })
  ]),

  exhibit("stringify map with circular reference", () => {
    const map: Map<string, any> = new Map()
    map.set("key", map)
    return stringify(map, testWriter)
  }).check([
    property("it prints the map with a circular indicator", (result) => {
      assert.deepEqual(result, `Map {\n  "key" => <CIRCULAR>\n}`)
    })
  ]),

  exhibit("stringify list", () => {
    return stringify(list([1, problem(2), 3, 4]), testWriter)
  }).check([
    property("it prints the list", (result) => {
      assert.deepEqual(result, "\n  • 1\n  • error(2)\n  • 3\n  • 4")
    })
  ]),

  exhibit("stringify message", () => {
    return stringify(message`This is something ${value("cool")}: ${value(27)} and other stuff.`, testWriter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "info(This is something \"cool\": 27 and other stuff.)")
    })
  ]),

  exhibit("stringify message with a generated string", () => {
    return stringify(message`This is ${"something"}.`, testWriter)
  }).check([
    property("it prints the message", (result) => {
      assert.deepEqual(result, "info(This is something.)")
    })
  ]),

  exhibit("stringify the type names", () => {
    return stringify(message`${typeName(true)}, ${typeName("hello")}, ${typeName(1)}, ${typeName({foo: "bar"})}, ${typeName(["hello"])}, ${typeName(() => {})}, ${typeName(Symbol("fun"))}, ${typeName(BigInt("234452"))}, ${typeName(undefined)}`, testWriter)
  }).check([
    property("it prints the type name", (result) => {
      assert.deepEqual(result, "info(a boolean, a string, a number, an object, an array, a function, a symbol, a bigint, undefined)")
    })
  ]),

  exhibit("stringify a times message", () => {
    return stringify(message`${times(0)}, ${times(1)}, ${times(5)}`, testWriter)
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
    ], testWriter)
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
    }, testWriter)
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
    }, testWriter)
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
