# Great Expectations!

Great Expectations provides a framework for constructing rich descriptions
of values. It can be used in most javascript testing frameworks, and it works in both
node or the browser. Use Great Expectations with Typescript to get faster feedback on
the descriptions you write.

There are two guiding principles behind the design of Great Expectations:

1. Descriptions should be determinate.

Consider a numeric value. One might be tempted to describe it by asserting that
it is `not 7` or `less than 8`. While this narrows down the possibilities, it still
leaves the value itself vague. Great Expectations was designed to be used in example-
based tests where the test writer should have enough control over the test conditions
to know exactly what value to expect. Therefore, Great Expectations does not come
with matchers for `not` or `less than` etc.

Note that there could be good reasons for using matchers that do not describe a
value with determinacy -- property-based testing frameworks or fuzz testing might
benefit from those, but, again, Great Expectations was written with example-based
testing in mind.

2. It should be very easy to add new matchers.

In Great Expectations, a `matcher` is just a function from a value to a `MatchResult`.
The `MatchResult` contains information about how to describe what was expected
in human-readable terms. So, while Great Expectations does come with a basic set of
matchers, it should be easy enough to create new matchers that are domain-specific,
which can make your test suite easier to read and easier to extend.


### Getting Started

```
npm install --save-dev great-expectations
```

Here's how you would use Great Expectations in a mocha test:

```
import { expect, is, equalTo } from "great-expectations"

it("some test", () => {
  expect(7, is(equalTo(5)))
})
```

### Writing Expectations

#### expect(actual, MatchEvaluator)

The expect function evaluates an actual value against the provided description. It will
throw an Error if the actual value does not match, which is generally sufficient to cause
a test to fail in most JS testing frameworks.

A `MatchEvaluator` specifies whether the evaluation will occur synchronously or after
a Promise resolves. Use `is` in most cases, and `resolvesTo` or `rejectsWith` in cases where
the actual value is a Promise.


### MatchEvaluators

#### is(matcher): MatchEvaluator

Evaluates the provided matcher against the actual value synchronously.

```
expect([1, 2, 3], is(listWhereItemAt(2, equalTo(3))))
```

#### resolvesTo(matcher): MatchEvaluator

Evaluates the provided matcher against the promised actual value, when that promise resolves.
Fails if the promise rejects.


### Basic Matchers

#### equalTo(expected)

Asserts that the actual value is deeply equal to the expected value.

#### identicalTo(expected)

Asserts that the actual value is the same instance as the expected value (ie `===`).

#### defined()

Asserts that the actual value is defined (ie not `undefined`).

#### satisfying(array of matchers)

Asserts that the actual value matches all of the provided matchers.

```
expect("something fun", is(satisfying([
  stringContaining("fun"),
  stringContaining("something")
])))
```


### String Matchers

#### stringWithLength(length)

Asserts that the actual value is a string with the given length.

```
expect("", is(stringWithLength(0)))
```

#### stringContaining(expected, { caseSensitive: true, times: undefined })

Asserts that the actual value is a string that contains the expected value at
least one time. The optional options specify whether the match should be case
sensitive and whether the string should be expected to occur some specific
number of times.

#### stringMatching(regex)

Asserts that the actual value is a string that matches the provided regular expression.


### Array Matchers

#### arrayWithLength(number)

Asserts that the actual value is an array with the given length

#### arrayContaining(matcher, { times: undefined })

Asserts that the actual value is an array with at least one item that matches
the provided matcher. The optional option specifies whether some specific
number of items should match.

#### arrayWithItemAt(index, matcher)

Asserts that the actual value is an array with an item at the provided index
that matches the provided matcher.

#### arrayWith(array of matchers, { withAnyOrder: false })

Asserts that the actual value is an array with exactly items that match the provided
array of matchers in the given order. The optional option specifies whether
order matters.

```
expect([ 1, 2, 3 ], is(arrayWhere([
  equalTo(1),
  equalTo(2),
  equalTo(3)
])))
```


### Object Matchers

#### objectWithProperty(propertyName, matcher)

Asserts that the actual value is an object with an own property of the given name and a
value that matches the provided matcher.

#### objectWith(matcherObject)

Asserts that the actual value is an object that has all the properties of the provided
matcher object and the values of those properties match the matchers associated with each
propery in the matcher object. The actual object may have additional properties and still
match.

```
expect({ name: "cool dude", age: 288 }, is(objectWhere({
  name: stringContaining("cool"),
  age: equalTo(288)
})))
```


### Creating Custom Matchers

A matcher is just a function from a value to a `MatchResult`, which is either an
instance of `Valid` or `Invalid`. Here's an example of an `even` matcher:

```
function even(): Matcher<number> {
  return (actual) => {
    if (actual % 2 === 0) {
      return new Valid({
        actual,
        expected: description("a number that is even")
      })
    } else {
      return new Invalid("The actual number was not even.", {
        actual: problem(actual),
        expected: problem(description("a number that is even"))
      })
    }
  }
}
```

Then you can just use it like any other matcher:

```
expect(8, is(even()))
```

#### MatchResult

A type that is either `Valid` or `Invalid`. All `MatchResult` instances following this
interface:

```
{
  type: "valid" | "invalid"
  values: { actual: any, expected: any }
}
```

#### Valid({ actual, expected }): MatchResult

Create a `Valid` when the actual value matches what's expected.

The `actual` and `expected` values are used to present these values when necessary.
These can each be any value but you can use `message` to create human readable
descriptions.

#### Invalid(description, { actual, expected }): MatchResult

Create an `Invalid` when the actual value fails to match what's expected.

The `actual` and `expected` values are used to present these values when necessary.
These can each be any value but you can use `message` to create human readable
descriptions, and `problem` to indicate unexpected values.

Instances of `Invalid` also have a `description` field.

#### message`template literal`

Produces a message from the given template literal. String expressions will be printed as is;
other expressions will be stringified. Use `value`, `problem`, and `list` to markup expressions.

#### value(value)

Stringifies a given value for pretty output.

#### problem(value)

Highlights a value as problematic in the output.

#### list(array of values)

Stringifies the values into a pretty list for output.
