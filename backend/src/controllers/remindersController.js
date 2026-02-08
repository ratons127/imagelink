import { prisma } from "../config/prisma.js";
import { scheduleReminder } from "../services/reminderService.js";

export const createReminder = async (req, res, next) => {
  try {
    const reminder = await scheduleReminder({
      taskId: req.body.taskId,
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
