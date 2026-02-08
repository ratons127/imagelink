import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("phone").isString().isLength({ min: 7, max: 20 })
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").isString()
];

export const refreshValidator = [
  body("refreshToken").isString()
];
