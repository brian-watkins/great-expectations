import { Matcher } from "./matcher"

export function expectedCountMessage(expectedTimes: number | Matcher<number>): string {
  if (typeof expectedTimes === "number" && expectedTimes == 1) {
    return "exactly 1 time"
  }

  if (typeof expectedTimes === "number") {
    return `exactly ${expectedTimes} times`
  }

  return `%expected% times`
}
