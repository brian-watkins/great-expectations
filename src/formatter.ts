export interface Formatter {
  red(message: string): string
}

function wrapColor(code: string, message: string): string {
  return "\x1b[" + code + "m" + message + "\x1b[39m"
}

function red(message: string): string {
  return wrapColor("31", message)
}

export const ANSIFormatter: Formatter = {
  red
}