import { MatchEvaluator } from "../../../src/index.js"

export function expect<T, S>(value: T, evaluator: MatchEvaluator<T, S>, description?: string): S {
  try {
    return evaluator(value, description)
  } catch (err: any) {
    const e = new Error(`\n\t\x1b[0m${err.message}\n\n\t${err.details.split(`\n`).join(`\n\t`)}`)
    e.stack = err.stack
    throw e
  }
}