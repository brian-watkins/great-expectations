import { validate } from "esbehavior";
import isIdenticalToBehavior from "./isIdenticalTo.behavior";
import isFalseBehavior from "./isFalse.behavior";
import isTrueBehavior from "./isTrue.behavior";
import equalsBehavior from "./equals.behavior";

validate([
  isIdenticalToBehavior,
  equalsBehavior,
  isTrueBehavior,
  isFalseBehavior
], {
  failFast: true
})