import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { prisma } from "../config/prisma.js";
import { sendSms } from "../services/smsService.js";

const worker = new Worker(
  "reminders",
  async (job) => {
    const { reminderId } = job.data;
    const reminder = await prisma.reminder.findFirst({
      where: { id: reminderId }
    });
    if (!reminder || reminder.status !== "pending") return;

    const task = await prisma.task.findFirst({ where: { id: reminder.taskId } });
    const user = await prisma.user.findFirst({ where: { id: reminder.userId } });
    if (!task || !user) return;

    try {
      const body = `TaskFlow reminder: ${task.title}`;
      await sendSms({ to: user.phone, body });
      await prisma.reminder.update({
        where: { id: reminderId },
        data: { status: "sent", sentAt: new Date() }
      });
    } catch (err) {
      const attempts = reminder.attempts + 1;
      await prisma.reminder.update({
        where: { id: reminderId },
        data: {
          attempts,
          lastError: String(err.message || err),
          status: attempts >= 3 ? "failed" : "pending"
        }
      });
      if (attempts < 3) throw err;
    }
  },
  { connection: redis, concurrency: 5 }
);

const sweepPendingReminders = async () => {
  const now = new Date();
  const upcoming = new Date(Date.now() + 5 * 60 * 1000);
  const reminders = await prisma.reminder.findMany({
    where: {
      status: "pending",
      remindAt: { lte: upcoming }
    }
  });
  for (const r of reminders) {
    await worker.queue.add(
      "sendReminder",
      { reminderId: r.id },
      { jobId: r.id, delay: Math.max(0, r.remindAt.getTime() - now.getTime()) }
    );
  }
};

setInterval(() => {
  sweepPendingReminders().catch((err) => console.error("Reminder sweep failed", err));
}, 60 * 1000);

worker.on("failed", (job, err) => {
  console.error(`Reminder job ${job.id} failed`, err.message);
});

console.log("TaskFlow reminder worker running");
