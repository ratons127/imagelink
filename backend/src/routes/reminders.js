import { Router } from "express";
import * as remindersController from "../controllers/remindersController.js";
import { authRequired } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reminderCreateValidator } from "../validators/reminders.js";

const router = Router();

router.get("/", authRequired, remindersController.listReminders);
router.post("/", authRequired, reminderCreateValidator, validate, remindersController.createReminder);

export default router;
