import { behavior, effect, example } from "esbehavior";
import { Invalid, equalTo, expect, stringContaining, throws } from "../src";
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError";
import { assertHasActualMessage, assertHasExpectedMessage, assertHasMessage, assertIsInvalidMatch } from "./helpers";

export default behavior("expect throws", [

  example()
    .description("the actual value is thrown from a thunk")
    .script({
      observe: [
        effect("it runs the match as expected", () => {
          expect(() => { throw "blah blah blah" }, throws(stringContaining("blah")))
        })
      ]
    }),

  example()
    .description("the thunk does not throw as expected")
    .script({
      observe: [
        effect("it throws a MatchError", () => {
          assert.throws(() => {
            expect(() => "nothing", throws(equalTo("hello")))
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid)
            assertHasMessage("The function did not throw.", err.invalid)
            assertHasActualMessage("error(info(a function that did not throw))", err.invalid)
            assertHasExpectedMessage("error(info(a function that throws))", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("a description is provided")
    .script({
      observe: [
        effect("it prints the description", () => {
          assert.throws(() => {
            expect(() => { throw "yo yo" }, throws(stringContaining("blah")), "Should throw blah!")
          }, (err: MatchError) => {
            assertHasMessage("Should throw blah!", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("a value is provided that matches the thrown value")
    .script({
      observe: [
        effect("it reports a valid match", () => {
          expect(() => { throw "blah blah blah" }, throws("blah blah blah"))
        })
      ]
    }),

  example()
    .description("a value is provided that does not match the thrown value")
    .script({
      observe: [
        effect("it reports an invalid equalTo match", () => {
          assert.throws(() => {
            expect(() => { throw "yo yo" }, throws("blah"))
          }, (err: MatchError) => {
            const expectedInvalid = equalTo("blah")("yo yo") as Invalid
            assertHasMessage(expectedInvalid.description, err.invalid)
            assert.deepEqual(err.invalid.values, expectedInvalid.values)
            return true
          })
        })
      ]
    }),

  example()
    .description("a value is provided that does not match the thrown value, with a description")
    .script({
      observe: [
        effect("it reports an invalid equalTo match", () => {
          assert.throws(() => {
            expect(() => { throw "yo yo" }, throws("blah"), "Hope this works!")
          }, (err: MatchError) => {
            assertHasMessage("Hope this works!", err.invalid)
            return true
          })
        })
      ]
    })

])
