import { equalTo, is } from "../../../src/index.js"
import { expect } from "./helpers.js"

test("it does some stuff", () => {
  expect(7, is(equalTo(5)))
})