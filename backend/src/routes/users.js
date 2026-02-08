import { Router } from "express";
import * as usersController from "../controllers/usersController.js";
import { authRequired } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { body } from "express-validator";

const router = Router();

router.get("/me", authRequired, usersController.me);
router.put(
  "/me",
  authRequired,
  [body("name").optional().isString(), body("phone").optional().isString()],
  validate,
  usersController.updateMe
);

export default router;
