import { validate } from "esbehavior";
import isIdenticalToBehavior from "./isIdenticalTo.behavior.js";
import equalsBehavior from "./equals.behavior.js";
import isArrayWhereBehavior from "./isArrayWhere.behavior.js";
import stringifyBehavior from "./stringify.behavior.js";
import isStringContainingBehavior from "./isStringContaining.behavior.js";
import isArrayWithLengthBehavior from "./isArrayWithLength.behavior.js";
import isArrayContainingBehavior from "./isArrayContaining.behavior.js";
import isStringWithLengthBehavior from "./isStringWithLength.behavior.js";
import satisfyingAllBehavior from "./satisfyingAll.behavior.js";
import isStringMatchingBehavior from "./isStringMatching.behavior.js";
import isArrayWhereItemAtBehavior from "./isArrayWhereItemAt.behavior.js";
import isDefinedBehavior from "./isDefined.behavior.js";
import resolvesToBehavior from "./resolvesTo.behavior.js";
import isBehavior from "./is.behavior.js";
import isObjectWithPropertyBehavior from "./isObjectWithProperty.behavior.js";
import isObjectWhereBehavior from "./isObjectWhere.behavior.js";
import rejectsWithBehavior from "./rejectsWith.behavior.js";
import assignedWithBehavior from "./assignedWith.behavior.js";
import isMapWithBehavior from "./isMapWith.behavior.js";
import isMapContainingBehavior from "./isMapContaining.behavior.js";
import throwsBehavior from "./throws.behavior.js";
import isObjectOfTypeBehavior from "./isObjectOfType.behavior.js";
import eventuallyBehavior from "./eventually.behavior.js";
import errorFormatBehavior from "./errorFormat.behavior.js";
import isValueWhereBehavior from "./isValueWhere.behavior.js";
import isSetWithBehavior from "./isSetWith.behavior.js";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  isDefinedBehavior,
  assignedWithBehavior,
  isArrayWithLengthBehavior,
  isArrayWhereBehavior,
  isArrayWhereItemAtBehavior,
  isArrayContainingBehavior,
  isMapWithBehavior,
  isMapContainingBehavior,
  isValueWhereBehavior,
  isStringContainingBehavior,
  isStringWithLengthBehavior,
  isStringMatchingBehavior,
  isObjectOfTypeBehavior,
  isObjectWithPropertyBehavior,
  isObjectWhereBehavior,
  isSetWithBehavior,
  stringifyBehavior,
  satisfyingAllBehavior,
  isBehavior,
  resolvesToBehavior,
  rejectsWithBehavior,
  throwsBehavior,
  eventuallyBehavior,
  errorFormatBehavior
], {
  failFast: true
})