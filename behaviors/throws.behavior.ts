import { behavior, effect, example } from "esbehavior";
import { equalTo, expect, stringContaining, throws } from "../src";
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
            expect(() => "yo yo", throws(stringContaining("blah")), "Should throw blah!")
          }, (err: MatchError) => {
            assertHasMessage("Should throw blah!", err.invalid)
            return true
          })
        })
      ]
    })

])
