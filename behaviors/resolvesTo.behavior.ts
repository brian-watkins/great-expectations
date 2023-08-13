import { behavior, effect, example } from "esbehavior"
import { equalTo, expect, stringContaining, resolvesTo, Invalid } from "../src/index.js"
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"
import { assertHasActualMessage, assertHasExpectedMessage, assertHasMessage, assertIsInvalidMatch } from "./helpers.js"

export default behavior("expect resolvesTo", [

  example()
    .description("the actual value is the result of a promise")
    .script({
      observe: [
        effect("it runs the match as expected", async () => {
          await expect(Promise.resolve("blah blah"), resolvesTo(stringContaining("blah", { times: 2 })))
        })
      ]
    }),
  
  example()
    .description("the promised value fails to match")
    .script({
      observe: [
        effect("it throws the MatchError", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah blah"), resolvesTo(stringContaining("blah", { times: 21 })))
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
        effect("it prints the description", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah blah"), resolvesTo(stringContaining("blah", { times: 21 })), "Should be blah!")
          }, (err: MatchError) => {
            assertHasMessage("Should be blah!", err.invalid)
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
            await expect(Promise.reject("blah"), resolvesTo(equalTo(17)))
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid)
            assertHasMessage("The promise was unexpectedly rejected.", err.invalid)
            assertHasActualMessage("error(info(a promise that rejected with:\n\n\"blah\"))", err.invalid)
            assertHasExpectedMessage("error(info(a promise that resolves))", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("the promised value rejects, with a provided description")
    .script({
      observe: [
        effect("it prints the provided description", async () => {
          await assert.rejects(async () => {
            await expect(Promise.reject("blah"), resolvesTo(equalTo(17)), "Wish it were a number!")
          }, (err: MatchError) => {
            assertIsInvalidMatch(err.invalid)
            assertHasMessage("Wish it were a number!", err.invalid)
            assertHasActualMessage("error(info(a promise that rejected with:\n\n\"blah\"))", err.invalid)
            assertHasExpectedMessage("error(info(a promise that resolves))", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("a value is provided that equals the promised actual")
    .script({
      observe: [
        effect("it reports a valid match", async () => {
          await expect(Promise.resolve("blah blah"), resolvesTo("blah blah"))
        })
      ]
    }),

  example()
    .description("a value is provided that does not equal the promised actual")
    .script({
      observe: [
        effect("it reports an invalid equalTo match", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah blah"), resolvesTo("who dis?"))
          }, (err: MatchError) => {
            const expectedInvalid = equalTo("who dis?")("blah blah") as Invalid
            assertHasMessage(expectedInvalid.description, err.invalid)
            assert.deepEqual(err.invalid.values, expectedInvalid.values)
            return true
          })
        })
      ]
    }),

  example()
    .description("a value is provided that does not equal the promised actual, with a description")
    .script({
      observe: [
        effect("it prints the description", async () => {
          await assert.rejects(async () => {
            await expect(Promise.resolve("blah blah"), resolvesTo("who dis?"), "Special Greeting Expected")
          }, (err: MatchError) => {
            assertHasMessage("Special Greeting Expected", err.invalid)
            return true
          })
        })
      ]
    })

])