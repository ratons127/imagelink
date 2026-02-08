import { prisma } from "../config/prisma.js";
import { reminderQueue } from "./queue.js";

export const scheduleReminder = async ({ taskId, userId, remindAt }) => {
  if (!remindAt) return null;
  const reminder = await prisma.reminder.create({
    data: { taskId, userId, remindAt }
  });
  await reminderQueue.add(
    "sendReminder",
    { reminderId: reminder.id },
    { jobId: reminder.id, delay: Math.max(0, new Date(remindAt).getTime() - Date.now()) }
  );
  return reminder;
};

export const rescheduleReminder = async ({ reminderId, remindAt }) => {
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: { remindAt, status: "pending", attempts: 0, lastError: null, sentAt: null }
  });
  await reminderQueue.add(
    "sendReminder",
    { reminderId: reminder.id },
    { jobId: reminder.id, delay: Math.max(0, new Date(remindAt).getTime() - Date.now()) }
  );
  return reminder;
};

export const upsertTaskReminder = async ({ taskId, userId, remindAt }) => {
  const existing = await prisma.reminder.findFirst({
    where: { taskId, userId }
  });
  if (!remindAt) {
    if (existing) {
      await prisma.reminder.delete({ where: { id: existing.id } });
    }
    return null;
  }
  if (!existing) {
    return scheduleReminder({ taskId, userId, remindAt });
  }
  return rescheduleReminder({ reminderId: existing.id, remindAt });
};
