import { behavior } from "esbehavior";
import { equalTo, arrayWith } from "../src/index.js";
import { message, problem, value } from "../src/message.js";
import { exhibit, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers.js";

export default behavior("isArrayWhere", [

  exhibit("the array matches", () => {
    return arrayWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ])([1, 2, 3])
  }).check([
    isValidMatchResult(),
    hasActual([value(1), value(2), value(3)]),
    hasExpected([
      message`a number that equals 1`,
      message`a number that equals 2`,
      message`a number that equals 3`,
    ])
  ]),

  exhibit("the actual array does not have the expected number of items", () => {
    return arrayWith([equalTo(1), equalTo(2), equalTo(3)])([1, 2])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array length (2) is unexpected."),
    hasInvalidActual([1, 2]),
    hasExpectedMessageText("error(info(an array with length 3))")
  ]),

  exhibit("the array fails to match at an item", () => {
    return arrayWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ])([1, 6, 5])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array failed to match."),
    hasExpected([
      message`a number that equals 1`,
      problem(message`a number that equals 2`),
      problem(message`a number that equals 3`)
    ]),
    hasActual([value(1), problem(6), problem(5)]),
  ]),

  exhibit("the array fails to match when not ordered as expected", () => {
    return arrayWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ], { withAnyOrder: false })([3, 1, 2])
  }).check([
    isInvalidMatchResult()
  ]),

  exhibit("the array is matched regardless of order", () => {
    return arrayWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ], { withAnyOrder: true })([3, 1, 2])
  }).check([
    isValidMatchResult()
  ]),

  exhibit("the unexpected value is displayed for an array that fails to match regardless of order", () => {
    return arrayWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ], { withAnyOrder: true })([ 3, 6, 2 ])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array failed to match."),
    hasExpected([
      problem(message`a number that equals 1`),
      message`a number that equals 2`,
      message`a number that equals 3`
    ]),
    hasActual([3, problem(6), 2])
  ]),

  exhibit("the correct unexpected value is displayed for identical matchers within the array", () => {
    return arrayWith([
      equalTo(2),
      equalTo(2),
      equalTo(3)
    ], { withAnyOrder: true })([ 3, 6, 2 ])
  }).check([
    isInvalidMatchResult(),
    hasMessage("The array failed to match."),
    hasExpected([
      message`a number that equals 2`,
      problem(message`a number that equals 2`),
      message`a number that equals 3`
    ]),
    hasActual([3, problem(6), 2])
  ])

])
