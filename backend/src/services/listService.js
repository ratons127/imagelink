import { prisma } from "../config/prisma.js";

export const createList = async ({ userId, name }) => {
  return prisma.taskList.create({
    data: {
      name,
      ownerId: userId,
      members: {
        create: { userId, role: "owner" }
      }
    }
  });
};

export const getLists = async ({ userId }) => {
  return prisma.taskList.findMany({
    where: {
      deletedAt: null,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } }
      ]
    },
    include: { members: true }
  });
};

export const updateList = async ({ listId, userId, name }) => {
  await ensureListAccess(listId, userId, "owner");
  return prisma.taskList.update({
    where: { id: listId },
    data: { name }
  });
};

export const deleteList = async ({ listId, userId }) => {
  await ensureListAccess(listId, userId, "owner");
  return prisma.taskList.update({
    where: { id: listId },
    data: { deletedAt: new Date() }
  });
};

export const addMember = async ({ listId, userId, memberId, role }) => {
  await ensureListAccess(listId, userId, "owner");
  return prisma.taskListMember.upsert({
    where: { listId_userId: { listId, userId: memberId } },
    update: { role: role || "member" },
    create: { listId, userId: memberId, role: role || "member" }
  });
};

export const removeMember = async ({ listId, userId, memberId }) => {
  await ensureListAccess(listId, userId, "owner");
  return prisma.taskListMember.deleteMany({
    where: { listId, userId: memberId }
  });
};

export const ensureListAccess = async (listId, userId, requiredRole = "member") => {
  const membership = await prisma.taskListMember.findFirst({
    where: { listId, userId }
  });
  const list = await prisma.taskList.findFirst({ where: { id: listId, deletedAt: null } });
  if (!list) {
    const err = new Error("List not found");
    err.status = 404;
    throw err;
  }
  if (!membership) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }
  if (requiredRole === "owner" && membership.role !== "owner") {
    const err = new Error("Owner role required");
    err.status = 403;
    throw err;
  }
  return membership;
};
