import { Invalid, matcher, Matcher, Valid } from "./matcher.js"
import { message, Message, problem, value } from "./message.js"

export function valueWhere<T>(predicate: (x: NoInfer<T>) => boolean, expects: string | Message): Matcher<T> {
  const expectedDescription = message`${expects}`

  return matcher(expectedDescription, (actual) => {
    if (predicate(actual)) {
      return new Valid({
        actual: value(actual),
        expected: expectedDescription
      })
    } else {
      return new Invalid("The value does not satisfy the predicate.", {
        actual: problem(actual),
        expected: problem(expectedDescription)
      })
    }
  })
}
