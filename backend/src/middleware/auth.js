import { verifyAccessToken } from "../utils/tokens.js";
import { prisma } from "../config/prisma.js";

export const authRequired = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null }
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = { id: user.id, email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
