import { validate } from "esbehavior";
import isIdenticalToBehavior from "./isIdenticalTo.behavior";
import equalsBehavior from "./equals.behavior";
import isArrayWhereBehavior from "./isArrayWhere.behavior";
import stringifyBehavior from "./stringify.behavior";
import isStringContainingBehavior from "./isStringContaining.behavior";
import isArrayWithLengthBehavior from "./isArrayWithLength.behavior";
import isArrayContainingBehavior from "./isArrayContaining.behavior";
import numberLessThanBehavior from "./numberLessThan.behavior";
import numberLessThanOrEqualToBehavior from "./numberLessThanOrEqualTo.behavior";
import numberGreaterThanBehavior from "./numberGreaterThan.behavior";
import numberGreaterThanOrEqualToBehavior from "./numberGreaterThanOrEqualTo.behavior";
import isStringWithLengthBehavior from "./isStringWithLength.behavior";
import satisfyingAllBehavior from "./satisfyingAll.behavior";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  // isArrayWithLengthBehavior,
  // isArrayWhereBehavior,
  // isArrayContainingBehavior,
  isStringContainingBehavior,
  // isStringWithLengthBehavior,
  stringifyBehavior,
  numberLessThanBehavior,
  numberLessThanOrEqualToBehavior,
  numberGreaterThanBehavior,
  numberGreaterThanOrEqualToBehavior,
  // satisfyingAllBehavior
], {
  failFast: true
})