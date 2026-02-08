import { prisma } from "../config/prisma.js";

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      select: { id: true, email: true, phone: true, name: true, createdAt: true }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: req.body.name ?? undefined,
        phone: req.body.phone ?? undefined
      },
      select: { id: true, email: true, phone: true, name: true, createdAt: true }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
