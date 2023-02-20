import { behavior, effect, example } from "esbehavior"
import { equalTo, expect, rejectsWith, stringContaining } from "../src/index.js"
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"
import { assertHasActual, assertHasActualMessage, assertHasExpectedMessage, assertHasMessage, assertIsInvalidMatch } from "./helpers.js"
import { problem } from "../src/message.js"

export default behavior("expect rejectsWith", [

  example()
    .description("the actual value is the rejection of a promise")
    .script({
      observe: [
        effect("it runs the match as expected", async () => {
          await expect(Promise.reject("blah blah"), rejectsWith(stringContaining("blah", { times: 2 })))
        })
      ]
    }),
  
  example()
    .description("the rejected value fails to match")
    .script({
      observe: [
        effect("it throws a MatchError as expected", async () => {
          await assert.rejects(async () => {
            await expect(Promise.reject("error!"), rejectsWith(equalTo(17)))
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid),
            assertHasActual(problem("error!"), err.invalid),
            assertHasExpectedMessage("error(info(a number that equals 17))", err.invalid)
            return true
          })
        })
      ]
    }),
  
  example()
    .description("a message is provided")
    .script({
      observe: [
        effect("it prints the message", async () => {
          await assert.rejects(async () => {
            await expect(Promise.reject("error!"), rejectsWith(equalTo(17)), "Should be a number!")
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid),
            assertHasMessage("Should be a number!", err.invalid)
            assertHasActual(problem("error!"), err.invalid),
            assertHasExpectedMessage("error(info(a number that equals 17))", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("the promise resolves instead of rejecting")
    .script({
      observe: [
        effect("it throws a MatchError explaining the unexpected resolve", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah"), rejectsWith(equalTo(17)))
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid)
            assertHasMessage("The promise unexpectedly resolved.", err.invalid)
            assertHasActualMessage("error(info(a promise that resolved with \"blah\"))", err.invalid)
            assertHasExpectedMessage("error(info(a promise that rejects))", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("the promise resolves instead of rejecting, with a provided description")
    .script({
      observe: [
        effect("it prints the description", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah"), rejectsWith(equalTo(17)), "Would be cool if it were a number!")
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid)
            assertHasMessage("Would be cool if it were a number!", err.invalid)
            assertHasActualMessage("error(info(a promise that resolved with \"blah\"))", err.invalid)
            assertHasExpectedMessage("error(info(a promise that rejects))", err.invalid)
            return true
          })
        })
      ]
    })

])
