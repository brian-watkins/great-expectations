import { description, Invalid, Matcher, problem, Valid } from "./matcher";

export function isObjectWithProperty<T>(property: PropertyKey, matcher: Matcher<T>): Matcher<any> {
  return (actual) => {
    if (!Object.hasOwn(actual, property)) {
      return new Invalid("The object does not have the specified property.", {
        actual: problem(actual),
        expected: problem(description("an object with a property %expected%", property))
      })
    }

    const result = matcher(actual[property])

    const message = description("an object with a property %expected% that is %expected%", property, result.values.expected)

    switch (result.type) {
      case "valid":
        return new Valid({
          actual,
          expected: message
        })  
      case "invalid":
        return new Invalid("The value at the specified property is unexpected.", {
          actual: problem(actual),
          expected: problem(message)
        })
    }
  }
}