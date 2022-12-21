export function typeName(value: any): string {
  switch (typeof(value)) {
    case "object":
      return "an object"
    case "number":
      return "a number"
    case "string":
      return "a string"
    default:
      return "not done yet"
  }
}

export function timesMessage(count: number): string {
  if (count === 1) {
    return "exactly 1 time"
  } else {
    return `exactly ${count} times`
  }
}
