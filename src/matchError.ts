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

  get details(): string {
    return detail("Actual", this.actual) + detail("Expected", this.expected)
  }

  get actual(): string {
    return stringify(this.invalid.values.actual, ActualFormatter)
  }

  get expected(): string {
    return stringify(this.invalid.values.expected, ExpectedFormatter)
  }
}

function detail(label: string, message: string): string {
  return `${dim(underline(label))}\n\n${message}\n\n`
}

function dim(message: string): string {
  return `\x1b[2m${message}\x1b[22m`
}

function underline(message: string): string {
  return `\x1b[4m${message}\x1b[24m`
}
