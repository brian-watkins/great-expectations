
export function dim(message: string): string {
  return wrapWithCodes("\x1b[2m", message, "\x1b[22m")
}

export function underline(message: string): string {
  return wrapWithCodes("\x1b[4m", message, "\x1b[24m")
}

export function red(message: string): string {
  return wrapColor("31", message)
}

export function yellow(message: string): string {
  return wrapColor("33", message)
}

function wrapWithCodes(start: string, message: string, end: string): string {
  if (ansiCodesAreDisabled()) {
    return message
  }

  return start + message + end
}

function wrapColor(code: string, message: string): string {
  return wrapWithCodes("\x1b[" + code + "m", message, "\x1b[39m")
}

function ansiCodesAreDisabled(): boolean {
  if (typeof process === "undefined") {
    return false
  }

  const noColor = process.env["NO_COLOR"]

  return noColor !== undefined && noColor !== ""
}
