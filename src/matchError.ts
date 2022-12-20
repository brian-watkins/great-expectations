import { ActualFormatter, ExpectedFormatter } from "./formatter"
import { Invalid } from "./matcher"
import { stringify } from "./stringify"

export class MatchError<T> extends Error {
  constructor(private invalid: Invalid<T>, ...args: any) {
    super(invalid.description, ...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MatchError)
    }

    this.name = "MatchError"
  }

  get actual(): string {
    return stringify(this.invalid.values.actual, ActualFormatter)
  }

  // If we wanted to keep the representation super simple then here "less than 4"
  // we could actually create the representation that includes the subject
  // like "a number that is ..." but sometimes we do want the whole thing, like
  // in the isArrayWhere matcher I think
  // So maybe it's more like there's a default representation and then some elements
  // that can be used to construct a new representation?

  get expected(): string {
    return stringify(this.invalid.values.expected, ExpectedFormatter)
  }
}