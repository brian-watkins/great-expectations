import { behavior, effect, example } from "esbehavior"
import { expect, is, stringContaining } from "../src/index.js"
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"
import { assertHasExpectedMessage, assertHasMessage } from "./helpers.js"

export default behavior("expect is", [

  example()
    .description("the actual value is the result of a promise")
    .script({
      observe: [
        effect("it runs the match as expected", () => {
          expect("blah blah", is(stringContaining("blah", { times: 2 })))
        })
      ]
    }),

  example()
    .description("the actual value fails to match")
    .script({
      observe: [
        effect("it throws the MatchError", () => {
          assert.throws(() => {
            expect("blah blah", is(stringContaining("blah", { times: 21 })))
          }, (err: MatchError) => {
            assertHasExpectedMessage("error(info(a string that contains \"blah\" exactly 21 times))", err.invalid)
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
            expect("yo yo", is(stringContaining("blah")), "Should be blah!")
          }, (err: MatchError) => {
            assertHasMessage("Should be blah!", err.invalid)
            return true
          })
        })
      ]
    })

])