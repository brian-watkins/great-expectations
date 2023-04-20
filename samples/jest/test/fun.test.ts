import { equalTo, is } from "../../../src/index.js"
import { expect } from "./helpers.js"
// import chai from "chai"
// const expect = chai.expect

test("it does some stuff", () => {
  expect(7, is(equalTo(5)))
  // expect(7).to.equal(5)
})