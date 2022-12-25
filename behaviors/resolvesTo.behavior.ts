import { behavior, effect, example } from "esbehavior"
import { equals, expect, isStringContaining, resolvesTo } from "../src"
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"
import { assertHasActualMessage, assertHasExpectedMessage, assertHasMessage, assertIsInvalidMatch } from "./helpers"

export default behavior("expect resolvesTo", [

  example()
    .description("the actual value is the result of a promise")
    .script({
      observe: [
        effect("it runs the match as expected", async () => {
          await expect(Promise.resolve("blah blah"), resolvesTo(isStringContaining("blah", { times: 2 })))
        })
      ]
    }),
  
  example()
    .description("the promised value fails to match")
    .script({
      observe: [
        effect("it throws the MatchError", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah blah"), resolvesTo(isStringContaining("blah", { times: 21 })))
          }, (err: MatchError) => {
            assertHasExpectedMessage("error(info(a string that contains \"blah\" exactly 21 times))", err.invalid)
            return true
          })
        })
      ]
    }),
  
  example()
    .description("the promised value rejects")
    .script({
      observe: [
        effect("it throws a MatchError explaining the unexpected rejection", async () => {
          await assert.rejects(async () => {
            await expect(Promise.reject("blah"), resolvesTo(equals(17)))
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid)
            assertHasMessage("The promise was unexpectedly rejected.", err.invalid)
            assertHasActualMessage("error(info(a promise that rejected with \"blah\"))", err.invalid)
            assertHasExpectedMessage("error(info(a promise that resolves))", err.invalid)
            return true
          })
        })
      ]
    })

])