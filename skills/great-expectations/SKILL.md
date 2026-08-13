---
name: great-expectations
description: Write assertions using great-expectations — a TypeScript matcher library that builds rich, human-readable descriptions of values. Assertions are composed from a MatchEvaluator (`is`, `throws`, `resolvesTo`, `rejectsWith`, `eventually`) and a `Matcher<T>`. TRIGGER when code imports `great-expectations`; when a user asks to write, modify, review, or debug assertions in a project using great-expectations; or when discussing `expect`, `is`, `equalTo`, `stringContaining`, `arrayWith`, `objectWith`, `valueWhere`, `Matcher`, `MatchResult`, `Valid`, `Invalid`, or custom matcher design.
---

# Great Expectations

Great-expectations is a TypeScript matcher library whose guiding idea is that **an assertion should read like a description of the expected value**. A matcher is nothing more than a function `(actual: T) => MatchResult`, and the library ships a composable set of them so that `expect` calls read as natural English: *"expect the cart to be an object with a total that is a number greater than zero."*

Internalize that framing before writing assertions: if the call site reads as a sentence about what should be true, you're using the library correctly; if it reads like `assert.equal` with renamed helpers, you're not.

The library works in Node and the browser, with any test framework that treats a thrown error as a failure (best-behavior, mocha, jest, uvu). Set `NO_COLOR` to disable ANSI formatting.

## Mental model

Every assertion has the shape:

```ts
expect(actual, MatchEvaluator, description?)
```

- **`actual`** — the value under test.
- **`MatchEvaluator`** — decides *how* to evaluate: synchronously, against a thrown exception, against a resolved/rejected promise, or with retry.
- **`description?`** — optional human label shown on failure.

The `MatchEvaluator` is built by passing a `Matcher<T>` (or a raw value, which is sugar for `equalTo`) to one of `is` / `throws` / `resolvesTo` / `rejectsWith` / `eventually`.

```ts
expect(cart.total(), is(equalTo(42)))
expect(() => buy(item), throws(objectOfType(OutOfStockError)))
await expect(fetchUser(id), resolvesTo(objectWith({ name: equalTo("Alice") })))
await expect(fetchUser(bad), rejectsWith(objectOfType(NotFoundError)))
await expect(() => poll(), eventually(resolvesTo(equalTo("done")), { timeout: 200, waitFor: 75 }))
```

Matchers **compose**. Container matchers (`arrayWith`, `objectWith`, `mapWith`, `setWith`, `satisfying`, `assignedWith`, `arrayWithItemAt`, `objectWithProperty`, `arrayContaining`, `setContaining`, `mapContaining`) take other matchers as arguments. Most real assertions are a few matchers nested together.

The array, set, and map matchers accept readonly collections (`ReadonlyArray`, `as const` arrays, `ReadonlySet`, `ReadonlyMap`) as well as mutable ones — never copy or cast an actual value just to satisfy the types.

## The evaluators

| Evaluator                         | When to use                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `is(T \| Matcher<T>)`            | Synchronous check. Default choice.                                          |
| `throws(T \| Matcher<T>)`        | Actual is a no-argument function; asserts on the thrown value.              |
| `resolvesTo(T \| Matcher<T>)`    | Actual is a `Promise`; asserts on the resolved value. `await` the `expect`. |
| `rejectsWith(T \| Matcher<T>)`   | Actual is a `Promise`; asserts on the rejection reason. `await` the `expect`. |
| `eventually(evaluator, options)` | Actual is `() => T \| Promise<T>`; retry until success or timeout.          |

When the evaluator takes `T | Matcher<T>`, passing a plain value is equivalent to `equalTo(value)`. Passing a matcher lets you use any matcher expression.

`throws`: wrap the call under test in a no-argument function — `expect(() => myFunc("arg"), throws(objectOfType(SpecialError)))`. Fails if the function does not throw.

`eventually`: default timeout is 500ms with 30ms waits between attempts. The actual must be `() => T` (not a pre-resolved value), because retrying requires re-invoking.

## The matchers

### Basic

- `equalTo(expected)` — deep equality.
- `identicalTo(expected)` — same reference (`===`).
- `defined()` — not `undefined`.
- `assignedWith(matcher)` — not `undefined` **and** matches `matcher`. Use when the type is `T | undefined`.
- `satisfying([matcher, matcher, ...])` — all of the matchers must match. Use to combine constraints on the same value.

### String

- `stringWithLength(length)`
- `stringContaining(expected, { caseSensitive?, times? })`
- `stringMatching(regex, { times? })` — when `times` is set, include the `g` flag in the regex.

### Array

- `arrayWith([matcher, ...], { withAnyOrder? })` — exact length; each index matches the corresponding matcher. Default order matters.
- `arrayWithItemAt(index, matcher)` — only checks one position.
- `arrayContaining(matcher, { times? })` — at least one element matches. `times: 0` asserts absence; `times: N` asserts exactly N matches.
- `arrayWithLength(n)`

### Set

- `setWith([matcher, ...])` — exactly these elements (order-insensitive by nature of Set).
- `setContaining(matcher, { times? })` — like `arrayContaining`.
- `setWithSize(n)`

### Map

- `mapWith([{ key, value? }, ...])` — exactly these entries. `value` is optional if you only care about keys.
- `mapContaining({ key, value? })` — at least one matching entry.

### Object

- `objectOfType(Class)` — `instanceof` check.
- `objectWithProperty(name, matcher)` — one property at a time.
- `objectWith({ prop: matcher, ... })` — multiple properties; extra properties on the actual are ignored.
- `objectWith<UnionType, Variant>({...})` — for discriminated unions, supply the union type and the expected variant type as generics so the matcher types as `Matcher<UnionType>` while accepting variant-specific properties.

### Value

- `valueWhere(predicate, description)` — escape hatch for any boolean check. `description` is a string or a `Message`.

## Composition patterns

Think of writing an assertion as **describing the shape of the expected value, then letting the matchers mirror that shape**.

```ts
expect(order, is(objectWith({
  id: defined(),
  customer: objectWith({ name: stringContaining("Alice") }),
  items: arrayWith([
    objectWith({ sku: equalTo("A1"), qty: equalTo(2) }),
    objectWith({ sku: equalTo("B3"), qty: equalTo(1) })
  ]),
  tags: setContaining(equalTo("priority"))
})))
```

- Use `satisfying` when the same value must pass several independent checks: `is(satisfying([stringContaining("fun"), stringContaining("something")]))`.
- Use `arrayContaining(matcher, { times: 0 })` to assert *absence*.
- Use `assignedWith(matcher)` instead of `is(matcher)` when the compiler says the value could be `undefined` — it gives a clearer failure than letting the inner matcher trip on `undefined`.
- For partial object checks, `objectWith` is almost always the right tool (it ignores extra properties). Reach for `objectWithProperty` only when you care about exactly one field.

## Custom matchers: speak your domain

The most valuable thing great-expectations gives you is the ability to build **domain-specific matchers** that make tests read like sentences about the domain.

The easiest form is a function that returns an existing matcher:

```ts
function personNamed(expectedName: string): Matcher<Person> {
  return objectWithProperty("name", equalTo(expectedName))
}

expect(someone, is(personNamed("Cool Dude")))
```

`valueWhere` is the quickest route for simple predicates:

```ts
function greaterThan(lowerBound: number): Matcher<number> {
  return valueWhere(
    x => x > lowerBound,
    message`a number that is greater than ${value(lowerBound)}`
  )
}

expect(29, is(greaterThan(18)))
```

For full control of the failure output, build a `Matcher<T>` using the `matcher`
function directly:

```ts
const expectedMessage = message`a number that is even`
const even: Matcher<number> = matcher(expectedMessage, (actual) => {
  if (actual % 2 === 0) {
    return new Valid({
      actual: value(actual),
      expected: expectedMessage
    })
  } else {
    return new Invalid("The actual number was not even.", {
      actual: problem(actual),
      expected: problem(expectedMessage)
    })
  }
})
```

Both hand-rolled matchers and `valueWhere`-based matchers plug into `is`, `resolvesTo`, etc. just like the built-ins.

## Messages: how failures read

Custom matchers and `valueWhere` accept a `Message` (or a string). Build messages with the `message` template tag and format expressions with the formatter helpers:

- `value(v)` — pretty-print a valid value.
- `problem(v)` — highlight an unexpected value.
- `list([...])` — format an array as a readable list.
- `typeName(v)` — e.g. `typeName("hi")` → `"a string"`.
- `times(n, name?)` — `times(7)` → `"exactly 7 times"`, `times(7, "item")` → `"exactly 7 items"`.

```ts
message`${typeName(expected)} that contains ${value(expected)} ${times(2)}`
// → a string that contains "hello" exactly 2 times
```

A well-written `Message` is the whole point: when the assertion fails, the developer reads the `expected` line and knows *what the test was claiming*, not just that two values differed.

## What to avoid

- **Skipping `is`.** `expect(x, equalTo(5))` won't type-check — evaluators like `is` are how matchers become evaluators. Read `is(equalTo(5))` as "is equal to 5"; the redundancy is deliberate.
- **Forgetting `await` with `resolvesTo` / `rejectsWith` / `eventually`.** These return `Promise<void>`; without `await`, failures escape the test.
- **Passing the resolved value to `resolvesTo`.** The evaluator needs the promise itself so it can await it: `expect(somePromise, resolvesTo(...))`, not `expect(await somePromise, resolvesTo(...))`.
- **Wrapping a value-returning call for `throws`.** `throws` requires a no-argument function as the actual. `expect(myFunc("x"), throws(...))` evaluates `myFunc` immediately — wrap it: `expect(() => myFunc("x"), throws(...))`.
- **Reaching for `valueWhere` before looking for a built-in.** Type-specific matchers give better failure messages. Use `valueWhere` for genuine domain predicates, not as a shortcut around `objectWith` / `arrayContaining` / etc.
- **Stringly-typed `objectWith` on unions.** If the property you're asserting belongs to one variant of a union, supply the generics: `objectWith<UnionType, Variant>({...})`.
- **Over-specifying arrays.** If order doesn't matter to the behavior under test, use `arrayWith([...], { withAnyOrder: true })` or `arrayContaining`. Don't lock the test to an accidental order.

## Minimal cheat sheet

```ts
import {
  expect,
  is, throws, resolvesTo, rejectsWith, eventually,
  equalTo, identicalTo, defined, assignedWith, satisfying,
  stringContaining, stringMatching, stringWithLength,
  arrayWith, arrayWithItemAt, arrayContaining, arrayWithLength,
  setWith, setContaining, setWithSize,
  mapWith, mapContaining,
  objectOfType, objectWith, objectWithProperty,
  valueWhere,
  message, value, problem, list, typeName, times,
  Valid, Invalid, type Matcher, type MatchResult
} from "great-expectations"
```
