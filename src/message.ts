export function matchCountMessage(expectedTimes: number): string {
  if (expectedTimes == 1) {
    return "exactly 1 time"
  }

  return `exactly ${expectedTimes} times`
}
