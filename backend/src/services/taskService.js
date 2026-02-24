import { prisma } from "../config/prisma.js";
import { ensureListAccess } from "./listService.js";
import { upsertTaskReminder } from "./reminderService.js";

export const createTask = async ({ userId, data }) => {
  await ensureListAccess(data.listId, userId);
  const task = await prisma.task.create({
    data: {
      listId: data.listId,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      reminderTime: data.reminderTime ? new Date(data.reminderTime) : null,
      priority: data.priority || "medium",
      status: data.status || "todo",
      tags: data.tags || [],
      order: data.order || 0,
      assignedToId: data.assignedToId || null
    }
  });
  if (data.reminderTime) {
    await upsertTaskReminder({ taskId: task.id, userId, remindAt: data.reminderTime });
  }
  return task;
};

export const updateTask = async ({ userId, taskId, data }) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, deletedAt: null } });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  await ensureListAccess(task.listId, userId);
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title ?? task.title,
      description: data.description ?? task.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : task.dueDate,
      reminderTime: data.reminderTime ? new Date(data.reminderTime) : data.reminderTime === null ? null : task.reminderTime,
      priority: data.priority ?? task.priority,
      status: data.status ?? task.status,
      tags: data.tags ?? task.tags,
      order: data.order ?? task.order,
      archivedAt: data.archivedAt ? new Date(data.archivedAt) : data.archivedAt === null ? null : task.archivedAt,
      assignedToId: data.assignedToId ?? task.assignedToId
    }
  });
  if (data.reminderTime !== undefined) {
    await upsertTaskReminder({ taskId: task.id, userId, remindAt: data.reminderTime });
  }
  return updated;
};

export const deleteTask = async ({ userId, taskId }) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, deletedAt: null } });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  await ensureListAccess(task.listId, userId);
  return prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() }
  });
};

export const listTasks = async ({ userId, filters, page = 1, pageSize = 20 }) => {
  const where = {
    deletedAt: null,
    list: {
      deletedAt: null,
      members: { some: { userId } }
    }
  };

  if (filters.status) where.status = filters.status;
  if (filters.listId) where.listId = filters.listId;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.archived === "true") where.archivedAt = { not: null };
  if (filters.archived === "false") where.archivedAt = null;
  if (filters.archived === undefined) where.archivedAt = null;

  if (filters.view === "my-day") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    where.dueDate = { gte: start, lte: end };
  }
  if (filters.view === "planned") {
    where.dueDate = { not: null };
  }
  if (filters.view === "important") {
    where.priority = "high";
  }
  if (filters.view === "completed") {
    where.status = "done";
  }

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { subtasks: true, list: true, assignedTo: true },
      orderBy: [{ status: "asc" }, { order: "asc" }, { dueDate: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.task.count({ where })
  ]);

  return { items, total, page, pageSize };
};

export const createSubtask = async ({ userId, taskId, title }) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, deletedAt: null } });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  await ensureListAccess(task.listId, userId);
  return prisma.subTask.create({
    data: { taskId, title }
  });
};

export const updateSubtask = async ({ userId, subtaskId, data }) => {
  const sub = await prisma.subTask.findFirst({ where: { id: subtaskId } });
  if (!sub) {
    const err = new Error("Subtask not found");
    err.status = 404;
    throw err;
  }
  const task = await prisma.task.findFirst({ where: { id: sub.taskId, deletedAt: null } });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  await ensureListAccess(task.listId, userId);
  return prisma.subTask.update({
    where: { id: subtaskId },
    data: {
      title: data.title ?? sub.title,
      done: data.done ?? sub.done,
      order: data.order ?? sub.order
    }
  });
};

export const deleteSubtask = async ({ userId, subtaskId }) => {
  const sub = await prisma.subTask.findFirst({ where: { id: subtaskId } });
  if (!sub) {
    const err = new Error("Subtask not found");
    err.status = 404;
    throw err;
  }
  const task = await prisma.task.findFirst({ where: { id: sub.taskId, deletedAt: null } });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  await ensureListAccess(task.listId, userId);
  return prisma.subTask.delete({ where: { id: subtaskId } });
};
