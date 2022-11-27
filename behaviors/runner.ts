import { validate } from "esbehavior";
import isIdenticalToBehavior from "./isIdenticalTo.behavior";
import isFalseBehavior from "./isFalse.behavior";
import isTrueBehavior from "./isTrue.behavior";
import equalsBehavior from "./equals.behavior";
import isArrayWhereBehavior from "./isArrayWhere.behavior";
import stringifyBehavior from "./stringify.behavior";
import isStringContainingBehavior from "./isStringContaining.behavior";
import isArrayWithLengthBehavior from "./isArrayWithLength.behavior";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  isTrueBehavior,
  isFalseBehavior,
  isArrayWithLengthBehavior,
  isArrayWhereBehavior,
  isStringContainingBehavior,
  stringifyBehavior,
], {
  failFast: true
})