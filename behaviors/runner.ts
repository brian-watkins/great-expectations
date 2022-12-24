import { validate } from "esbehavior";
import isIdenticalToBehavior from "./isIdenticalTo.behavior";
import equalsBehavior from "./equals.behavior";
import isArrayWhereBehavior from "./isArrayWhere.behavior";
import stringifyBehavior from "./stringify.behavior";
import isStringContainingBehavior from "./isStringContaining.behavior";
import isArrayWithLengthBehavior from "./isArrayWithLength.behavior";
import isArrayContainingBehavior from "./isArrayContaining.behavior";
import isStringWithLengthBehavior from "./isStringWithLength.behavior";
import satisfyingAllBehavior from "./satisfyingAll.behavior";
import isStringMatchingBehavior from "./isStringMatching.behavior";
import isArrayWhereItemAtBehavior from "./isArrayWhereItemAt.behavior";
import isDefinedBehavior from "./isDefined.behavior";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  isDefinedBehavior,
  isArrayWithLengthBehavior,
  isArrayWhereBehavior,
  isArrayWhereItemAtBehavior,
  isArrayContainingBehavior,
  isStringContainingBehavior,
  isStringWithLengthBehavior,
  isStringMatchingBehavior,
  stringifyBehavior,
  satisfyingAllBehavior
], {
  failFast: true
})