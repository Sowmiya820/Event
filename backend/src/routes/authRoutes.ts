import { Router } from "express";
import { z } from "zod";
import { login, me, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const registerSchema = z.object({ body: z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) }) });
const loginSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8) }) });

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
