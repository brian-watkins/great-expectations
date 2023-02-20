import { ActualFormatter, ExpectedFormatter } from "./formatter.js"
import { Invalid } from "./matcher.js"
import { stringify } from "./stringify.js"

export class MatchError extends Error {
  constructor(public invalid: Invalid, ...args: any) {
    super(invalid.description, ...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MatchError)
    }

    this.name = "MatchError"
  }

  get actual(): string {
    return stringify(this.invalid.values.actual, ActualFormatter)
  }

  get expected(): string {
    return stringify(this.invalid.values.expected, ExpectedFormatter)
  }
}