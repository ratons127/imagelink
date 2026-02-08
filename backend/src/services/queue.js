import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const reminderQueue = new Queue("reminders", {
  connection: redis
});
