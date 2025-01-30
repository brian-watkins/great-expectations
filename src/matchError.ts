import { ActualWriter, ExpectedWriter } from "./writer.js"
import { Invalid } from "./matcher.js"
import { stringify } from "./stringify.js"
import { dim, underline } from "./formatter.js"

export class MatchError extends Error {
  constructor(public invalid: Invalid, ...args: any) {
    super(invalid.description, ...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MatchError)
    }

    this.name = "MatchError"
  }

  get details(): string {
    return detail("Actual", this.actual) + detail("Expected", this.expected)
  }

  get actual(): string {
    return stringify(this.invalid.values.actual, ActualWriter)
  }

  get expected(): string {
    return stringify(this.invalid.values.expected, ExpectedWriter)
  }
}

function detail(label: string, message: string): string {
  return `${dim(underline(label))}\n\n${message}\n\n`
}

