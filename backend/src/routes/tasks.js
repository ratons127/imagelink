import { Router } from "express";
import * as tasksController from "../controllers/tasksController.js";
import { authRequired } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { taskCreateValidator, taskUpdateValidator, subtaskValidator } from "../validators/tasks.js";

const router = Router();

router.get("/", authRequired, tasksController.listTasks);
router.post("/", authRequired, taskCreateValidator, validate, tasksController.createTask);
router.put("/:id", authRequired, taskUpdateValidator, validate, tasksController.updateTask);
router.delete("/:id", authRequired, tasksController.deleteTask);

router.post("/:id/subtasks", authRequired, subtaskValidator, validate, tasksController.createSubtask);
router.put("/subtasks/:subtaskId", authRequired, tasksController.updateSubtask);
router.delete("/subtasks/:subtaskId", authRequired, tasksController.deleteSubtask);

export default router;
