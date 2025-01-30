import { behavior, Context, effect, example, fact } from "esbehavior";
import { MatchError } from "../src/matchError";
import { Invalid, problem } from "../src";
import { strict as assert } from "node:assert"

const envVarContext: Context<void> = {
  init: () => undefined,
  teardown: () => {
    delete process.env["NO_COLOR"]
  }
}

export default behavior("error formatting", [

  example(envVarContext)
    .description("NO_COLOR env var is not set")
    .script({
      observe: [
        effect("colors are displayed in the formatted MatchError", () => {
          const invalid = new Invalid("test-description", {
            actual: problem("actual value"),
            expected: problem("expected value")
          })
          const error = new MatchError(invalid)
          assert.equal(`\x1B[2m\x1B[4mActual\x1B[24m\x1B[22m

\x1B[31m"actual value"\x1B[39m

\x1B[2m\x1B[4mExpected\x1B[24m\x1B[22m

\x1B[33m"expected value"\x1B[39m\


`, error.details)
        })
      ]
    }),

  example(envVarContext)
    .description("NO_COLOR env var is set")
    .script({
      suppose: [
        fact("the NO_COLOR environment variable is set with a non-empty value", () => {
          process.env["NO_COLOR"] = "1"
        })
      ],
      observe: [
        effect("ANSI codes are not displayed in the formatted MatchError", () => {
          const invalid = new Invalid("test-description", {
            actual: problem("actual value"),
            expected: problem("expected value")
          })
          const error = new MatchError(invalid)
          assert.equal(`Actual

"actual value"

Expected

"expected value"

`, error.details)
        })
      ]
    }),

  example(envVarContext)
    .description("NO_COLOR env var is set and empty")
    .script({
      suppose: [
        fact("the NO_COLOR environment variable is set with an empty value", () => {
          process.env["NO_COLOR"] = ""
        })
      ],
      observe: [
        effect("ANSI codes are displayed in the formatted MatchError", () => {
          const invalid = new Invalid("test-description", {
            actual: problem("actual value"),
            expected: problem("expected value")
          })
          const error = new MatchError(invalid)
          assert.equal(`\x1B[2m\x1B[4mActual\x1B[24m\x1B[22m

\x1B[31m"actual value"\x1B[39m

\x1B[2m\x1B[4mExpected\x1B[24m\x1B[22m

\x1B[33m"expected value"\x1B[39m\


`, error.details)
        })
      ]
    })

])