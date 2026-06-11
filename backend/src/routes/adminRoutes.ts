import { Router } from "express";
import { z } from "zod";
import { adminStats, listUsers, updateUserRole } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate, authorize("admin"));
router.get("/stats", adminStats);
router.get("/users", listUsers);
router.patch("/users/:id/role", validate(z.object({ body: z.object({ role: z.enum(["user", "organizer", "admin"]) }) })), updateUserRole);

export default router;
