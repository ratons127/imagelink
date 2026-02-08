import { Router } from "express";
import * as listController from "../controllers/listController.js";
import { authRequired } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { listCreateValidator, listUpdateValidator, listMemberValidator } from "../validators/lists.js";

const router = Router();

router.get("/", authRequired, listController.getLists);
router.post("/", authRequired, listCreateValidator, validate, listController.createList);
router.put("/:id", authRequired, listUpdateValidator, validate, listController.updateList);
router.delete("/:id", authRequired, listController.deleteList);

router.post("/:id/members", authRequired, listMemberValidator, validate, listController.addMember);
router.delete("/:id/members/:userId", authRequired, listController.removeMember);

export default router;
