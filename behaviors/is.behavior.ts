import { behavior, effect, example } from "esbehavior"
import { Invalid, equalTo, expect, is, stringContaining } from "../src/index.js"
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"
import { assertHasExpectedMessage, assertHasMessage } from "./helpers.js"

export default behavior("expect is", [

  example()
    .description("the actual value matches")
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
    }),

  example()
    .description("a value is provided that equals the actual")
    .script({
      observe: [
        effect("it reports a valid match", () => {
          expect(17, is(17))
        })
      ]
    }),

  example()
    .description("a value is provided that does not equal the actual")
    .script({
      observe: [
        effect("it reports an invalid match", () => {
          assert.throws(() => {
            expect(17, is(21))
          }, (err: MatchError) => {
            const expectedInvalid = equalTo(21)(17) as Invalid
            assertHasMessage(expectedInvalid.description, err.invalid)
            assert.deepEqual(err.invalid.values, expectedInvalid.values)
            return true
          })
        })
      ]
    })

])