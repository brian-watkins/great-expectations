# Great Expectations!

Great Expectations provides a framework for constructing rich descriptions
of values. It can be used in most javascript testing frameworks, and it works in both
node or the browser. Use Great Expectations with Typescript to get faster feedback on
the descriptions you write.

In Great Expectations, a `matcher` is just a function from a value to a `MatchResult`.
The `MatchResult` contains information about how to describe what was expected
in human-readable terms. So, while Great Expectations does come with a basic set of
matchers, it should be easy enough to create new matchers that are domain-specific,
which can make your test suite easier to read and easier to extend.


### Getting Started

```
npm install --save-dev great-expectations
```

Great Expectations is an excellent matcher library to use with the coolest
test framework around:
[best-behavior](https://github.com/brian-watkins/best-behavior). But,
you can also use Great Expectations with other javascript testing frameworks, like
mocha, jest, uvu. In the case of mocha and jest, you'll need a small adapter
to ensure that test failures are printed in the best way. Check out the
[samples](./samples/) to see how it's done.

Here's how you would use Great Expectations in a best-behavior test:

```
import { behavior, example, effect } from "best-behavior"
import { expect, is, equalTo } from "great-expectations"

export default behavior("some behavior", [
  example()
    .description("some cool case")
    .script({
      observe: [
        effect("it does the right thing", () => {
          expect("This is cool!", is(stringContaining("cool")))        
        })
      ]
    })
])
```

Note: If you need to disable ANSI escape code color formatting, set
the `NO_COLOR` environment variable to a non-empty value.

### Writing Expectations

#### `expect(actual, MatchEvaluator, description?)`

The expect function evaluates an actual value against the provided matcher. It will
throw an Error if the actual value does not match, which is generally sufficient to cause
a test to fail in most JS testing frameworks.

A `MatchEvaluator` specifies whether the evaluation will occur synchronously or after
a Promise resolves. Use `is` in most cases, and `resolvesTo` or `rejectsWith` in cases where
the actual value is a Promise. If you need to automatically retry an expectation
until some timeout, use `eventually`.

Optionally, provide a description that will display with any invalid matches.


### MatchEvaluators

#### `is(T | Matcher<T>): MatchEvaluator`

If the provided value is a matcher, it evaluates the provided matcher against
the actual value synchronously. Otherwise, it checks that the provided value deeply
equals the actual value.

```
expect([1, 2, 3], is(arrayWithItemAt(2, equalTo(3))))
```

#### `throws(T | Matcher<T>): MatchEvaluator`

If the provided value is a matcher, it evaluates the provided matcher against
any exception thrown when the actual no-argument function is called. Otherwise,
it checks that the provided value deeply equals the actual thrown value. To expect
that functions with arguments should throw, wrap the call to the function under
test with a no-argument function. Fails if the no-argument function does not
throw when called.

```
expect(() => { myFunc("some argument") }, throws(objectOfType(SpecialError)))
```

#### `resolvesTo(T | Matcher<T>): MatchEvaluator`

If the provided value is a matcher, it evaluates the provided matcher against
the promised actual value, when that promise resolves. Otherwise, it checks that
the provided value deeply equals the promized actual value. Fails if the promise
rejects.

#### `rejectsWith(T | Matcher<T>): MatchEvaluator`

If the provided value is a matcher, it evaluates the provided matcher against
the value received with that promise rejects. Othewise, it checks that the
provided value deeply equals the rejected value. Fails if the promise resolves.

#### `eventually(MatchEvaluator, { timeout?: number, waitFor? number }): MatchEvaluator`

Evaluates a value of type `() => T` (where `T` can be a Promise) using the
provided evaluator. If the evaluation fails, it will wait for some time and
try again until a timeout is reached. By default, `eventually` will wait for
30ms before trying again, and it will continue to retry for up to 500ms. Adjust
these values by passing in an options parameter that specifies the `timeout`
and `waitFor` time in milliseconds, as in this example:

```
await expect(
  () => someFunctionThatReturnsAPromise(),
  eventually(resolvesTo(someValue), {
    timeout: 200,
    waitFor: 75
  })
)
```


### Basic Matchers

#### `equalTo(expected)`

Asserts that the actual value is deeply equal to the expected value.

#### `identicalTo(expected)`

Asserts that the actual value is the same instance as the expected value (ie `===`).

#### `defined()`

Asserts that the actual value is defined (i.e. not `undefined`).

#### `assignedWith(matcher)`

Asserts that the actual variable is assigned a value (i.e. not `undefined`) and that
it matches the provided matcher. Use this matcher when the expected value is potentially
undefined.

```
const someVariable: string | undefined = "hello"
expect(someVariable, is(assignedWith(stringContaining("he"))))
```

#### `satisfying(array of matchers)`

Asserts that the actual value matches all of the provided matchers.

```
expect("something fun", is(satisfying([
  stringContaining("fun"),
  stringContaining("something")
])))
```


### String Matchers

#### `stringWithLength(length)`

Asserts that the actual value is a string with the given length.

```
expect("", is(stringWithLength(0)))
```

#### `stringContaining(expected, { caseSensitive?: boolean, times?: number })`

Asserts that the actual value is a string that contains the expected value at
least one time. The options specify whether the match should be case
sensitive and whether the string should be expected to occur exactly some
number of times.

#### `stringMatching(regex, { times?: number })`

Asserts that the actual value is a string that matches the provided regular
expression. The options specify whether the matcg should occur exactly
some number of times. Note: If you specify a number of times to match, be
sure to include the global flag `g` in your regex so that it will look for
all occurrences.


### Array Matchers

#### `arrayWith(array of matchers, { withAnyOrder?: boolean })`

Asserts that the actual value is an array with elements such that
there is exactly one element that matches each of the provided
array of matchers in the given order, and no more elements. The
`withAnyOrder` option specifies whether order matters.

```
expect([ 1, 2, 3 ], is(arrayWith([
  equalTo(1),
  equalTo(2),
  equalTo(3)
])))
```

#### `arrayWithItemAt(index, matcher)`

Asserts that the actual value is an array with an element at the provided index
that matches the provided matcher.

#### `arrayContaining(matcher, { times?: number })`

Asserts that the actual value is an array with at least one element that matches
the provided matcher.

The `times` option specifies whether some exact number of elements
should match. For example, to assert that some element is not in an array:

```
expect([ 1, 2, 3 ], is(arrayContaining(equalTo(4), { times: 0 })))
```

If you need to assert that an array contains some subset of elements and
they can each be matched with distinct matchers, combine these matchers
using `satisfying`.

#### `arrayWithLength(number)`

Asserts that the actual value is an array with the given length


### Set Matchers

#### `setWith(array of matchers)`

Asserts that the actual value is a set with elements such that
there is exactly one element that matches each of the provided
array of matchers, and no more elements.

```
expect(new Set([ 1, 2, 3 ]), is(setWith([
  equalTo(1),
  equalTo(2),
  equalTo(3)
])))
```

#### `setContaining(matcher, { times?: number })`

Asserts that the actual value is a set with at least one element that matches
the provided matcher.

The `times` option specifies whether some exact number of elements
should match. For example, to assert that some element is not in a set:

```
expect(new Set([ 1, 2, 3 ]), is(setContaining(equalTo(4), { times: 0 })))
```

If you need to assert that a set contains some subset of elements and
they can each be matched with distinct matchers, combine these matchers
using `satisfying`.


### Map Matchers

#### `mapWith(array of MapEntryMatcher)`

Asserts that the actual value is a map with all and only entries that match the
given `MapEntryMatchers`.

A `MapEntryMatcher` is an object that conforms to this interface:

```
{
  key: Matcher<K>,
  value?: Matcher<V>
}
```

```
const map = new Map<string, string>()
map.set("Cool Key", "Let's Party!")
map.set("Another Key", "Let's do something fun!")

expect(map, is(mapWith([
  { key: equalTo("Cool Key") },
  { key: equalTo("Another Key"), value: stringContaining("something fun") }
])))
```

#### `mapContaining(MapEntryMatcher)`

Asserts that the actual map contains an entry that matches the given `MapEntryMatcher`.


### Object Matchers

#### `objectOfType(class)`

Asserts that the actual value is an object that instantiates the given class.

#### `objectWithProperty(propertyName, matcher)`

Asserts that the actual value is an object with an own property of the given name and a
value that matches the provided matcher.

#### `objectWith(matcherObject)`

Asserts that the actual value is an object that has all the properties of the provided
matcher object and the values of those properties match the matchers associated
with each propery in the matcher object. If the actual object has additional
properties, it will still match.

```
expect({ name: "cool dude", age: 288 }, is(objectWith({
  name: stringContaining("cool"),
  age: equalTo(288)
})))
```

#### `objectWith(matcherObject)` and discriminated unions

When writing an assertion about an object that can be any variant of a discriminated
union (call it `UnionType`), provide the type of the discriminated union and the type of the
expected variant to `objectWith`, and great-expectations will type the `objectWith`
matcher as a `Matcher<UnionType>` but allow the matcherObject to have the properties
of the expected variant.

For example:

```
type FunType = { kind: "fun", sport: string }
type AwesomeType = { kind: "awesome", food: string }
type UnionType = FunType | AwesomeType

const actual: UnionType = { kind: "fun", sport: "candlepin bowling" }

expect(actual, is(objectWith<UnionType, FunType>({
  type: equalTo("fun"),
  sport: stringContaining("bowling")
})))
```


### Value Matcher

Use the `valueWhere` matcher when you need more flexibility than other, type-specific
matchers provide.

#### `valueWhere(predicate, description)`

Asserts that the actual value satisfies the provided predicate.
The description is a string or a `Message` (see below); it will
be used to describe the expected value.

```
expect(40, is(valueWhere(x => x % 10 === 0, "a number that is a multiple of 10")))
```

The `valueWhere` matcher is useful as a quick way to construct domain-specific matchers.


### Creating Custom Matchers

The easiest way to create a custom matcher is just to create a function
that returns an existing matcher configured for your domain. For example,
here's a custom matcher that matches the `name` attribute in an object
that implements the `Person` interface:

```
interface Person {
  name: string
  address: Address
}

function personNamed(expectedName: string): Matcher<Person> {
  return objectWithProperty("name", equalTo(expectedName))
}
```

Then you can use the matcher like so:

```
expect(someone, is(personNamed("Cool Dude")))
```

Use this pattern to phrase your tests in terms of your domain language.

The `valueWhere` matcher can be particularly useful. Here's an example of
a `greaterThan` matcher:

```
function greaterThan(lowerBound: number): Matcher<number> {
  return valueWhere(
    x => x > lowerBound,
    message`a number that is greater than ${lowerBound}`
  )
}
```

which can then be used like so:

```
expect(29, is(greaterThan(18)))
```

For complicated cases, you can create matchers from scratch. A matcher is 
just a function from a value to a `MatchResult`, which is either an
instance of `Valid` or `Invalid`. While it's easy enough to create an 'even'
matcher like so:

```
const even = valueWhere(x => x % 2 === 0, "a number that is even")
```

You could create it from scratch:

```
const even: Matcher<number> = (actual) => {
  if (actual % 2 === 0) {
    return new Valid({
      actual: value(actual),
      expected: message`a number that is even`
    })
  } else {
    return new Invalid("The actual number was not even.", {
      actual: problem(actual),
      expected: problem(message`a number that is even`)
    })
  }
}
```

In either case, you can just use it like any other matcher:

```
expect(8, is(even))
```

#### `MatchResult`

A type that is either `Valid` or `Invalid`. `MatchResult` is a discriminated union
based on the `type` field. So it's possible to handle cases like so:

```
const matchResult = equalTo(7)(5)
switch (matchResult.type) {
  case "valid":
    // do something with the valid result
  case "invalid":
    // do something with the invalid result
}
```

#### `new Valid({ actual, expected }): MatchResult`

Create a `Valid` when the actual value matches what's expected. The instance looks
like this:

```
{
  type: "valid"
  values: {
    actual: Value | Problem | Message,
    expected: Value | Problem | Message
  }
}
```

The `actual` and `expected` values are used to present these values when necessary.
You can use `message` to create human readable descriptions, `value` to indicate valid
values, and `problem` to indicate unexpected values.

#### `new Invalid(description, { actual, expected }): MatchResult`

Create an `Invalid` when the actual value fails to match what's expected. The instance
looks like this:

```
{
  type: "invalid"
  description: string
  values: {
    actual: Value | Problem | Message,
    expected: Value | Problem | Message
  }
}
```

The `actual` and `expected` values are used to present these values when necessary.
You can use `message` to create human readable descriptions, `value` to indicate valid
values, and `problem` to indicate unexpected values.


### Creating Messages

#### `message`

Applies to a template literal and produces a message. String expressions will be printed
as is; other expressions will be stringified. Use `value`, `problem`, `list`, `typeName`,
and `times` to format expressions.

```
const expected = "hello"
message`${typeName(expected)} that contains ${value(expected)} ${times(2)}`
===> a string that contains "hello" exactly 2 times
```

#### `value(value)`

Stringifies a given value for pretty output.

#### `problem(value)`

Highlights a value as problematic in the output.

#### `list(array of values)`

Stringifies the values into a pretty list for output.

#### `typeName(value)`

Formats the type of the value for output.

```
typeName("hello") ===> "a string"
```

#### `times(count)`

Prints the number of times for output.

```
times(7) ===> "exactly 7 times"
```