import equal from "deep-equal"
import { Invalid, Matcher, Valid } from "./matcher"
import { MatchError } from "./MatchError"


export function expect<T>(value: T, matcher: Matcher<T>): void {
  const matchResult = matcher(value)
  switch (matchResult.type) {
    case "valid":
      return
    case "invalid":
      throw new MatchError(matchResult)
  }
}

// Matchers

export function isIdenticalTo<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (actual === expected) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not identical to the expected value.", {
        actual,
        expected
      })
    }
  }
}

export function equals<T>(expected: T): Matcher<T> {
  return (actual) => {
    if (equal(actual, expected, { strict: true })) {
      return new Valid()
    } else {
      return new Invalid("The actual value is not equal to the expected value.", {
        actual,
        expected
      })
    }
  }
}

export function isTrue(): Matcher<boolean> {
  return (actual) => {
    if (actual === true) {
      return new Valid()
    } else {
      return new Invalid("The actual value should be true, but it is not.")
    }
  }
}

export function isFalse(): Matcher<boolean> {
  return (actual) => {
    if (actual === false) {
      return new Valid()
    } else {
      return new Invalid("The actual value should be false, but it is not.")
    }
  }
}
