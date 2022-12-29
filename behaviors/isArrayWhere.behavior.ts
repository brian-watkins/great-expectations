import { behavior } from "esbehavior";
import { equalTo, arrayWith } from "../src";
import { description, problem } from "../src/matcher";
import { exhibit, hasActual, hasExpected, hasExpectedMessageText, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";

export default behavior("isArrayWhere", [

  exhibit("the array matches", () => {
    return arrayWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ])([1, 2, 3])
  }).check([
    isValidMatchResult(),
    hasActual([1, 2, 3]),
    hasExpected([
      description("a number that equals 1"),
      description("a number that equals 2"),
      description("a number that equals 3"),
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
      description("a number that equals 1"), 
      problem(description("a number that equals 2")),
      problem(description("a number that equals 3"))
    ]),
    hasActual([1, problem(6), problem(5)]),
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
      problem(description("a number that equals 1")), 
      description("a number that equals 2"),
      description("a number that equals 3")
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
      description("a number that equals 2"),
      problem(description("a number that equals 2")),
      description("a number that equals 3")
    ]),
    hasActual([3, problem(6), 2])
  ])

])
