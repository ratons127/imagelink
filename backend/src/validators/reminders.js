import { body } from "express-validator";

export const reminderCreateValidator = [
  body("taskId").isString(),
  body("remindAt").isISO8601()
];
