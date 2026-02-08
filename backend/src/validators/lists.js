import { body } from "express-validator";

export const listCreateValidator = [
  body("name").isString().isLength({ min: 1, max: 120 })
];

export const listUpdateValidator = [
  body("name").optional().isString().isLength({ min: 1, max: 120 })
];

export const listMemberValidator = [
  body("userId").isString(),
  body("role").optional().isIn(["owner", "member"])
];
