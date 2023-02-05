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
import resolvesToBehavior from "./resolvesTo.behavior";
import isBehavior from "./is.behavior";
import isObjectWithPropertyBehavior from "./isObjectWithProperty.behavior";
import isObjectWhereBehavior from "./isObjectWhere.behavior";
import rejectsWithBehavior from "./rejectsWith.behavior";
import assignedWithBehavior from "./assignedWith.behavior";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  isDefinedBehavior,
  assignedWithBehavior,
  isArrayWithLengthBehavior,
  isArrayWhereBehavior,
  isArrayWhereItemAtBehavior,
  isArrayContainingBehavior,
  isStringContainingBehavior,
  isStringWithLengthBehavior,
  isStringMatchingBehavior,
  isObjectWithPropertyBehavior,
  isObjectWhereBehavior,
  stringifyBehavior,
  satisfyingAllBehavior,
  isBehavior,
  resolvesToBehavior,
  rejectsWithBehavior
], {
  failFast: true
})