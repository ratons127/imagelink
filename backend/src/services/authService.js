import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

const ACCESS = "access";
const REFRESH_DAYS = 30;

export const register = async ({ email, password, phone }) => {
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, phone }
  });
  await prisma.taskList.create({
    data: {
      name: "My Tasks",
      ownerId: user.id,
      members: { create: { userId: user.id, role: "owner" } }
    }
  });
  return issueTokens(user.id, email);
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  return issueTokens(user.id, user.email);
};

export const refresh = async ({ refreshToken }) => {
  const payload = verifyRefreshToken(refreshToken);
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: { token: refreshToken, userId: payload.sub }
  });
  if (!tokenRecord) {
    const err = new Error("Invalid refresh token");
    err.status = 401;
    throw err;
  }
  return issueTokens(payload.sub, payload.email, refreshToken);
};

export const logout = async ({ refreshToken }) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  return { ok: true };
};

const issueTokens = async (userId, email, existingRefresh) => {
  const accessToken = signAccessToken({ sub: userId, email, typ: ACCESS });
  const refreshToken = existingRefresh || signRefreshToken({ sub: userId, email, typ: "refresh" });
  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
  if (!existingRefresh) {
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt }
    });
  }
  return { accessToken, refreshToken };
};
