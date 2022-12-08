export interface Formatter {
  info(message: string): string
  error(message: string): string
}

function wrapColor(code: string, message: string): string {
  return "\x1b[" + code + "m" + message + "\x1b[39m"
}

function red(message: string): string {
  return wrapColor("31", message)
}

function yellow(message: string): string {
  return wrapColor("33", message)
}

function info(message: string): string {
  return `${message}`
}

export const ActualFormatter: Formatter = {
  info,
  error: red,
}

export const ExpectedFormatter: Formatter = {
  info,
  error: yellow,
}


function identity(message: string): string {
  return message
}

export function noInfoFormatter(formatter: Formatter): Formatter {
  return {
    ...formatter,
    info: identity
  }
}

export function noErrorFormatter(formatter: Formatter): Formatter {
  return {
    ...formatter,
    error: identity,
  }
}
