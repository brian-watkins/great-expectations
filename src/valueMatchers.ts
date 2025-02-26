import { Invalid, Matcher, Valid } from "./matcher.js"
import { message, Message, problem, value } from "./message.js"

export function valueWhere<T>(predicate: (x: NoInfer<T>) => boolean, description: Message): Matcher<T> {
  return (actual) => {
    if (predicate(actual)) {
      return new Valid({
        actual: value(actual),
        expected: description
      })
    } else {
      return new Invalid("The value does not satisfy the predicate.", {
        actual: problem(actual),
        expected: problem(description)
      })
    }
  }
}
