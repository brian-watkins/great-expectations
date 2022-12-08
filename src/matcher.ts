// This could be MatchValues<T>
// and actual could be T | Problem<T>
// and expected could be T | Problem<T> | Problem<Description>>
// That would help with the functions like expectedCountMessage
// BUT we would need argument to be typed eventually and right now
// that can be a different type since some matchers take a matcher or
// array of matchers as an argument

// The fact that we want to be able to construct basically an arbitrary
// message from info about a matcher is still the hardest problem. How
// can a matcher publish enough info about itself to help with that?
// Or maybe number matchers are special in some way?

// Maybe there's something like for counts and length we have to provide a
// Matcher<Countable> or something and a Countable has more info somehow
// that it records somehow? But still actual and expected have to be
// stringifiable.
// If expected were a function would that help? And it could take a format string?
// So if we had Matcher<Formattable<number>> and formattable meant that you
// could pass in a string format? And that format string could have things like
// "%operator% %argument%" -- but still it would be hard to figure out whether to
// pluralize times or whatever. Maybe instead of a string you provide a function that
// takes an operator and an argument and returns a description? And Formattable
// would need to have some kind of default as well for when it's not being used by
// another matcher but just needs to be stringified.

// So this would require us to type the Actual and Expected ... and they could be
// Formattable<number> and that type is an object with a default message and a function
// that produces a message based on a given function you provide.

// It could be too Formattable<NumberComparator, Number> where the types there specify
// the arguments to the function that you can provide. So the type can inform you about
// what's available. We might after all want to print "<=" instead of "less than or equal to"

// So maybe we need a type for the Actual and a type for the Expected
// But by default these are the same
// But in fact the type for the expected will often be Description
// And we could have a FormattableDescription<arg1, arg2, ...> that has a default
// description or accepts a function with those args
// Then the number matchers would all be: 
// Matcher<number, FormattableDescription<Operator, number>>
// which we could alias to something like NumberMatcher

// We could do the same with IdenticalTo and EqualTo ... these would be:
// Matcher<T, FormattableDescription<T>>
// aliased to EqualityMatcher<T>
// That's a little risky because other matchers could have that same type and
// not do equality. But would it matter? 
// Like if you wanted to do:
// isStringContaining("blah", { times: satisfyingAll[ lessThan(5), greaterThan(2) ] })
// would that be possible?
// We'd have to do something like:
// Matcher<T, FormattableDescription<Array<FormattableDescription<??>>>
// You wouldn't want to restrict satisfyingAll to have to have matchers that all had
// the same kind of formattable description ...
// Question is, could you write a Matcher<number, FormattableDescription<operator, number>>
// that would wrap the 'between' matcher above? We'd have to make the operator be
// customizable somehow

// And then the times and count matchers would take (matcher: EqualityMatcher<number> | NumberMatcher)
// which is a little weird but much safer

// or maybe even NumberMatcher could be: EqualityMatcher<number> | Matcher<number, FormattableDescription<Comparator, number>>

export interface MatchValues<T, S=T> {
  actual: T
  operator: string
  expected: S
}

export class Valid<T> {
  public type: "valid" = "valid"

  constructor(public values: MatchValues<T>) {}
}

export class Invalid<T> {
  public type: "invalid" = "invalid"
  
  constructor(public description: string, public values: MatchValues<T>) {}
}

export type MatchResult<T> = Valid<T> | Invalid<T>

export type Matcher<T> = (actual: T) => MatchResult<T>

export interface Problem {
  type: "problem"
  value: any
}

export function problem(value: any): Problem {
  return {
    type: "problem",
    value
  }
}

export interface Description {
  type: "description"
  message: string
  next: Array<any>
}

export function description(message: string, ...next: Array<any | undefined>): Description {
  return {
    type: "description",
    message: `${message}`,
    next: next.filter(val => val !== undefined) as Array<any>
  }
}
