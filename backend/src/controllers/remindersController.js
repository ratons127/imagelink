import { prisma } from "../config/prisma.js";
import { scheduleReminder } from "../services/reminderService.js";
import { ensureListAccess } from "../services/listService.js";

export const createReminder = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.body.taskId, deletedAt: null },
      select: { id: true, listId: true }
    });
    if (!task) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }
    await ensureListAccess(task.listId, req.user.id);
    const reminder = await scheduleReminder({
      taskId: task.id,
      userId: req.user.id,
      remindAt: req.body.remindAt
    });
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};

export const listReminders = async (req, res, next) => {
  try {
    const items = await prisma.reminder.findMany({
      where: { userId: req.user.id },
      orderBy: { remindAt: "asc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};
