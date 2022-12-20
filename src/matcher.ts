import { nameOfType } from "./message"

export interface MatchValues<T> {
  actual: T | Problem<T>
  // operator: string
  // argument: any
  expected: Expected<T>
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

export interface Problem<T> {
  type: "problem"
  value: T
}

export function problem<T>(value: T): Problem<T> {
  return {
    type: "problem",
    value
  }
}

// Maybe all Expecteds are Descriptions
// and Description has more info like typeName, operator, value, even times?
// and then other matchers could get this info and use it to construct a
// meaningful message
// but in satisfyingAll, how would you know which to use for the typeName?
// equals might not have a typeName -- but it could based on typeof operator I guess
// and satisfyingAll itself doesn't know it's type name since it just deals with matchers
// And what about matchers that don't have a specific value ... one's that take other matchers?
// I guess the value would have to be a description

// It could be that Description is an interface and different matchers
// have to provide that implementation. So satisfyingAll might look through all
// its matchers to determine the typeName. And equals might run a function on
// the provided value. Others would just be static.

export interface ExpectedValue<T> {
  type: "expected-value"
  matches: string
  operator: string
  value: T
  representation: any
}

// Two problems so far:
// sometimes you want to stringify some value (like an array for isArrayWhere) instead
// of a description ...
// sometimes you want to indicate that something should be stringified as a problem
// sometimes you don't.
// maybe we need 'representation' instead of description ... and that can be an any type
// so it could be an array, it could be a description, it could be a problem(description)
// etc

// basically I'd like to only print the matches for the very top level expression when
// stringifying. Except in the case of isArrayWhere I think

export function expectedValue<T>(value: T, operator: string): Expected<T> {
  return {
    type: "expected-value",
    matches: nameOfType(value),
    operator,
    value,
    representation: description(`${nameOfType(value)} that ${operator} %expected%`, value)
  }
}

export function unsatisfiedExpectedValue<T>(value: T, operator: string): Expected<T> {
  return mapExpectedRepresentation(expectedValue(value, operator), problem)
  // return {
  //   type: "expected-value",
  //   matches: nameOfType(value),
  //   operator,
  //   value,
  //   representation: problem(description(`${nameOfType(value)} that ${operator} %expected%`, value))
  // }
}

export function mapExpectedRepresentation<T, S>(expected: Expected<T>, mapper: (rep: string) => S): Expected<T> {
  return {
    ...expected,
    representation: mapper(expected.representation)
  }
}

export interface ExpectedDescription {
  type: "expected-description"
  matches: string
  operator: string
  representation: any
}

export function expectedDescription(matches: string, operator: string, matchDescription: Description): ExpectedDescription {
  return {
    type: "expected-description",
    matches,
    operator,
    representation: description(`${matches} that ${operator} %expected%`, matchDescription)
  }
}

export function unsatisfiedExpectedDescription(matches: string, operator: string, matchDescription: Description): ExpectedDescription {
  return {
    type: "expected-description",
    matches,
    operator,
    representation: problem(description(`${matches} that ${operator} %expected%`, matchDescription))
  }
}


export type Expected<T> = ExpectedValue<T> | ExpectedDescription

// but still we need something like a default message
// sometimes we want to say "a number that is equal to 7"
// but other times we want to say "equal to 7" or even
// "exactly 7" or "7 times"
// I guess description is kind of the default message and
// then as you wrap matchers you modify the message explicitly
// based on the typeName and operator and given description kind
// of like we're doing now.
// Just not sure if we need all this stuff. It's just annoying I think
// that we spell out the typeName, operator, and value AND THEN construct
// a message based on those, so the info is kind of duplicated.
// I mean there could be a base implementatio of this interface that
// constructs a default message in a consistent way.


// I guess for something like times, it needs to be baked into the value description
// unless we had something like 'modifiers' which is just an array of descriptions to
// append? But do they always go at the end?

// Not sure this can handle satisfyingAll though ... there the value is an array
// of matchers -- same with isArrayWhere. Actually we need the list of Expecteds though
// so we can construct the proper message. But that would be inside the matcher
// itself. So it would just return something with a description

// Really we only need value in order to do the times and length matchers. So is there
// an easier way for that? Like provide different types of Expecteds? Like a
// NumberExpectation and a MetaExpectation etc? Then you need to be able to tell
// a caller that you supply that kind of expectation.

// And so you'd have Matcher<number, NumberExpectation> and Matcher<number, EqualsExpectation>
// or even Matcher<number, MetaExpectation> for satisfyingAll I guess.
// No these would just be a discriminated union of Expected types. so no need for
// the type annotation.
// But maybe the two types are ValueExpectation and MatcherExpectation?
// Really all I care about is being able to get the value 

// or ExpectedValue and ExpectedDescription

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
