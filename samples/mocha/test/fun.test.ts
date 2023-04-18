import { equalTo, is } from "../../../src/index.js"
import { expect } from "./helpers.js"

describe("some test", () => {
  it("fails", () => {
    expect(7, is(equalTo(5)))
  })
})