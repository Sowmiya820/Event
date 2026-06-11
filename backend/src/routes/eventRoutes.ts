import { Router } from "express";
import { z } from "zod";
import { categories, createEvent, deleteEvent, getEvent, listEvents, updateEvent } from "../controllers/eventController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const eventBody = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  category: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal("")),
  venue: z.string().min(2),
  city: z.string().min(2),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  ticketPrice: z.coerce.number().min(0),
  totalTickets: z.coerce.number().int().min(1),
  status: z.enum(["draft", "published", "cancelled"]).optional()
});

router.get("/", listEvents);
router.get("/categories", categories);
router.get("/:id", getEvent);
router.post("/", authenticate, authorize("organizer", "admin"), validate(z.object({ body: eventBody })), createEvent);
router.put("/:id", authenticate, authorize("organizer", "admin"), validate(z.object({ body: eventBody.partial() })), updateEvent);
router.delete("/:id", authenticate, authorize("organizer", "admin"), deleteEvent);

export default router;
