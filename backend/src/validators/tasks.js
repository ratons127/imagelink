import { body } from "express-validator";

export const taskCreateValidator = [
  body("listId").isString(),
  body("title").isString().isLength({ min: 1, max: 200 }),
  body("description").optional().isString(),
  body("dueDate").optional().isISO8601(),
  body("reminderTime").optional().isISO8601(),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("tags").optional().isArray(),
  body("assignedToId").optional().isString(),
  body("order").optional().isInt()
];

export const taskUpdateValidator = [
  body("title").optional().isString().isLength({ min: 1, max: 200 }),
  body("description").optional().isString(),
  body("dueDate").optional().isISO8601(),
  body("reminderTime").optional().isISO8601(),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("tags").optional().isArray(),
  body("assignedToId").optional().isString(),
  body("order").optional().isInt(),
  body("archivedAt").optional().isISO8601()
];

export const subtaskValidator = [
  body("title").isString().isLength({ min: 1, max: 200 })
];
