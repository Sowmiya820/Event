import type { Request, Response } from "express";
import { Event } from "../models/Event.js";

export async function listEvents(req: Request, res: Response) {
  const { search, category, city, minPrice, maxPrice, status = "published" } = req.query;
  const filter: Record<string, unknown> = { status };

  if (search) filter.$text = { $search: String(search) };
  if (category) filter.category = String(category);
  if (city) filter.city = new RegExp(String(city), "i");
  if (minPrice || maxPrice) {
    filter.ticketPrice = {};
    if (minPrice) (filter.ticketPrice as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.ticketPrice as Record<string, number>).$lte = Number(maxPrice);
  }

  const events = await Event.find(filter).populate("organizer", "name email").sort({ startsAt: 1 });
  return res.json({ events });
}

export async function getEvent(req: Request, res: Response) {
  const event = await Event.findById(req.params.id).populate("organizer", "name email");
  if (!event) return res.status(404).json({ message: "Event not found" });
  return res.json({ event });
}

export async function createEvent(req: Request, res: Response) {
  const event = await Event.create({ ...req.body, organizer: req.user?.id, availableTickets: req.body.totalTickets });
  return res.status(201).json({ event });
}

export async function updateEvent(req: Request, res: Response) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const isOwner = event.organizer.toString() === req.user?.id;
  if (!isOwner && req.user?.role !== "admin") return res.status(403).json({ message: "Not allowed" });

  Object.assign(event, req.body);
  await event.save();
  return res.json({ event });
}

export async function deleteEvent(req: Request, res: Response) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const isOwner = event.organizer.toString() === req.user?.id;
  if (!isOwner && req.user?.role !== "admin") return res.status(403).json({ message: "Not allowed" });

  await event.deleteOne();
  return res.status(204).send();
}

export async function categories(_req: Request, res: Response) {
  const categories = await Event.distinct("category", { status: "published" });
  return res.json({ categories });
}
