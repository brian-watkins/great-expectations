import { behavior } from "esbehavior";
import { exhibit, hasActual, hasExpected, hasInvalidActual, hasMessage, isInvalidMatchResult, isValidMatchResult } from "./helpers";
import { equalTo, message, problem, setWith, value } from "../src";

export default behavior("setWith", [

  exhibit("the set matches", () => {
    return setWith([
      equalTo(1),
      equalTo(2),
      equalTo(3)
    ])(new Set([1, 3, 2]))
  }).check([
    isValidMatchResult(),
    hasActual(new Set([value(1), value(2), value(3)])),
    hasExpected(new Set([
      message`a number that equals 1`,
      message`a number that equals 2`,
      message`a number that equals 3`,
    ]))
  ]),

  exhibit("the set does not match", () => {
    return setWith([
      equalTo(1),
      equalTo(21),
      equalTo(3)
    ])(new Set([1, 3, 2]))
  }).check([
    isInvalidMatchResult(),
    hasMessage("The set failed to match."),
    hasActual(new Set([value(1), problem(2), value(3)])),
    hasExpected(new Set([
      message`a number that equals 1`,
      problem(message`a number that equals 21`),
      message`a number that equals 3`,
    ]))
  ]),

  exhibit("the set has more members", () => {
    return setWith([
      equalTo(1),
      equalTo(21),
      equalTo(3)
    ])(new Set([1, 3, 21, 4, 5]))
  }).check([
    isInvalidMatchResult(),
    hasInvalidActual(new Set([value(1), value(3), value(21), value(4), value(5)])),
    hasExpected(problem(message`a set with size 3`)),
    hasMessage("The set size (5) is unexpected.")
  ])

])