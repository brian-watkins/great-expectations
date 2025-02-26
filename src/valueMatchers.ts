import { Invalid, Matcher, Valid } from "./matcher"
import { message, problem, typeName, value } from "./message"

export function valueWhere<T>(predicate: (x: NoInfer<T>) => boolean, description: string): Matcher<T> {
  return (actual) => {
    const expected = message`${typeName(actual)} that is ${description}`

    if (predicate(actual)) {
      return new Valid({
        actual: value(actual),
        expected: expected
      })
    } else {
      return new Invalid("The value does not satisfy the predicate.", {
        actual: problem(actual),
        expected: problem(expected)
      })
    }
  }
}
