import { ActualFormatter, ExpectedFormatter } from "./formatter"
import { Invalid } from "./matcher"
import { stringify } from "./stringify"

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