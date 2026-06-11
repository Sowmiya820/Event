import { Router } from "express";
import { z } from "zod";
import { confirmBooking, createPaymentIntent, getBooking, myBookings } from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.post("/payment-intent", validate(z.object({ body: z.object({ eventId: z.string(), quantity: z.number().int().min(1) }) })), createPaymentIntent);
router.post("/confirm", validate(z.object({ body: z.object({ paymentIntentId: z.string().min(1) }) })), confirmBooking);
router.get("/my", myBookings);
router.get("/:id", getBooking);

export default router;
