import { red, yellow } from "./formatter.js"

export interface Writer {
  info(message: string): string
  error(message: string): string
}


function info(message: string): string {
  return `${message}`
}

export const ActualWriter: Writer = {
  info,
  error: red,
}

export const ExpectedWriter: Writer = {
  info,
  error: yellow,
}


function identity(message: string): string {
  return message
}

export function noInfoWriter(writer: Writer): Writer {
  return {
    ...writer,
    info: identity
  }
}

export function noErrorWriter(writer: Writer): Writer {
  return {
    ...writer,
    error: identity,
  }
}
