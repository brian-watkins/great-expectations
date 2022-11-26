import { Invalid } from "./matcher"

export class MatchError extends Error {
  constructor(private invalid: Invalid<any>, ...args: any) {
    super(invalid.message, ...args)
  }

  get actual(): string {
    return this.invalid.values.actual
  }

  get expected(): string {
    return this.invalid.values.expected
  }
}