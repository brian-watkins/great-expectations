# Guiding Principles

Here are two principles we want to follow in writing great-expectations:

### 1. The matcher should do the selecting

Rather than writing something like `expect(list[2], stringContaining("fun"))` we should
write `expect(list, arrayWhereItemAt(2, stringContaining("fun"))`. That way, we avoid
problems where the matcher blows up because the list doesn't have 3 elements or something

### 2. Determinacy not vagueness

When you write an expectation, you should specify exactly what should be the case, with
as much precision as possible. This means that we will not have a `not` matcher. And we
will not allow for things like matching a string that contains "is" `less than` 3 times.
And we will try to avoid adding an `anything` matcher.

### 3. It should be very easy to add new matchers

It's important to make great-expectations easy to extend, so that test writers can create
matchers that are specific to the circumstances of their software. We should just provide
some basic matchers and easy ways to create the expected and actual messages.

Here are the basic matchers we propose:

- equals, identicalTo
- stringMatching(regex)
- stringContaining("blah", { caseInsensitive: true, times: 0 })
- stringWithLength
- arrayContaining(matcher, { times: 0 })
- arrayWithLength
- arrayWhere(Array{matcher}])
- arrayWhereItemAt(2, matcher)
- objectWith(propertyName, matcher)
- objectWhere({ name: matcher, name2: matcher })
- satisfying(Array{matcher})