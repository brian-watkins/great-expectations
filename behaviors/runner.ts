import { validate } from "esbehavior";
import isIdenticalToBehavior from "./isIdenticalTo.behavior";
import equalsBehavior from "./equals.behavior";
import isArrayWhereBehavior from "./isArrayWhere.behavior";
import stringifyBehavior from "./stringify.behavior";
import isStringContainingBehavior from "./isStringContaining.behavior";
import isArrayWithLengthBehavior from "./isArrayWithLength.behavior";
import isArrayContainingBehavior from "./isArrayContaining.behavior";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  isArrayWithLengthBehavior,
  isArrayWhereBehavior,
  isArrayContainingBehavior,
  isStringContainingBehavior,
  stringifyBehavior,
], {
  failFast: true
})