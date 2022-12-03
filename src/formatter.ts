export interface Formatter {
  info(message: string): string
  red(message: string): string
  green(message: string): string
}

function wrapColor(code: string, message: string): string {
  return "\x1b[" + code + "m" + message + "\x1b[39m"
}

function red(message: string): string {
  return wrapColor("31", message)
}

function green(message: string): string {
  return wrapColor("32", message)
}

function info(message: string): string {
  return `~ ${message} ~`
}

export const ANSIFormatter: Formatter = {
  info,
  red,
  green
}

function identity(message: string): string {
  return message
}

export const IdentityFormatter: Formatter = {
  info: identity,
  red: identity,
  green: identity
}