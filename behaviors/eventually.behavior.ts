import { behavior, effect, example } from "esbehavior";
import { equalTo, eventually, expect, is, resolvesTo } from "../src/index.js";
import { strict as assert } from "node:assert"
import { MatchError } from "../src/matchError"
import { assertHasActualMessage, assertHasExpectedMessage, assertHasMessage } from "./helpers.js"

export default behavior("eventually", [

  example()
    .description("synchronous expectation passes immediately")
    .script({
      observe: [
        effect("it passes", async () => {
          expect(() => 7, eventually(is(7)))
        })
      ]
    }),

  example()
    .description("synchronous expectation fails")
    .script({
      observe: [
        effect("it throws the MatchError", async () => {
          await assert.rejects(async () => {
            await expect(() => 7, eventually(is(equalTo(5)), { timeout: 100 }), "something that will never happen")
          }, (err: MatchError) => {
            assertHasMessage("something that will never happen", err.invalid)
            assertHasExpectedMessage("error(info(a number that equals 5))", err.invalid)
            assertHasActualMessage("error(7)", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("synchronous expectation passes eventually")
    .script({
      observe: [
        effect("it passes after several attempts", async () => {
          let value = 1
          const resolver = () => value++ % 5 == 0 ? true : false
          await expect(resolver, eventually(is(true)))
        })
      ]
    }),

  example()
    .description("asynchronous expectation passes")
    .script({
      observe: [
        effect("it passes", async () => {
          const resolver = () => new Promise<number>(resolve => setTimeout(() => resolve(7), 50))
          await expect(resolver, eventually(resolvesTo(7)))
        })
      ]
    }),

  example()
    .description("asynchronous expectation fails")
    .script({
      observe: [
        effect("it throws the MatchError", async () => {
          const resolver = () => new Promise<number>(resolve => setTimeout(() => resolve(14), 50))
          await assert.rejects(async () => {
            await expect(resolver, eventually(resolvesTo(5), { timeout: 150, waitFor: 20 }))
          }, (err: MatchError) => {
            assertHasMessage("The value did not match after 3 attempts over 150ms.", err.invalid)
            assertHasExpectedMessage("error(info(a number that equals 5))", err.invalid)
            assertHasActualMessage("error(14)", err.invalid)
            return true
          })
        })
      ]
    }),

  example()
    .description("asynchronous expectation passes eventually")
    .script({
      observe: [
        effect("it throws the MatchError", async () => {
          let count = 0
          const resolver = () => new Promise<number>(resolve => setTimeout(() => {
            count++ === 2 ? resolve(5) : resolve(7)
          }, 20))
          await expect(resolver, eventually(resolvesTo(5)))
        })
      ]
    })

])