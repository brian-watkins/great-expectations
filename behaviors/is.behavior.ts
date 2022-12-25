import { behavior, effect, example } from "esbehavior"
import { expect, is, isStringContaining } from "../src"
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"

export default behavior("expect is", [

  example()
    .description("the actual value is the result of a promise")
    .script({
      observe: [
        effect("it runs the match as expected", () => {
          expect("blah blah", is(isStringContaining("blah", { times: 2 })))
        })
      ]
    }),

  example()
    .description("the promised value fails to match")
    .script({
      observe: [
        effect("it throws the MatchError", () => {
          assert.throws(() => {
            expect("blah blah", is(isStringContaining("blah", { times: 21 })))
          }, (err: MatchError) => {
            assert.ok(err.expected.includes("a string that contains \"blah\" exactly 21 times"))
            return true
          })
        })
      ]
    })

])