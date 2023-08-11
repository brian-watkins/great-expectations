import { AssertionError } from "node:assert"
import { MatchEvaluator } from "../../../src/index.js"

export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>, description?: string): S {
  try {
    return evaluator(value, description)
  } catch (err: any) {
    const e = new AssertionError({
      operator: "fail",
      message: `\n\t\x1b[0m${err.message}\n\n\t${err.details.split(`\n`).join(`\n\t`)}`,
      actual: err.details.actual,
      expected: err.details.expected
    })
    const fixedStack = err.stack.split("\n").slice(4).join("\n")
    e.stack = `\n${fixedStack}`
    throw e
  }
}