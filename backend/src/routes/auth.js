import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { loginValidator, registerValidator, refreshValidator } from "../validators/auth.js";

const router = Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.post("/refresh", refreshValidator, validate, authController.refresh);
router.post("/logout", refreshValidator, validate, authController.logout);

export default router;
