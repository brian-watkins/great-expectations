import { Invalid } from "./matcher"
import { stringify } from "./stringify"

export class MatchError extends Error {
  constructor(private invalid: Invalid, ...args: any) {
    super(invalid.description, ...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MatchError)
    }

    this.name = "MatchError"
  }

  get actual(): string {
    return stringify(this.invalid.values.actual)
  }

  get expected(): string {
    return stringify(this.invalid.values.expected)
  }
}