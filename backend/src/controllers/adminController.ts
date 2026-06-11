import type { Request, Response } from "express";
import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";

export async function adminStats(_req: Request, res: Response) {
  const [users, events, bookings, revenue] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Booking.countDocuments(),
    Payment.aggregate([{ $match: { status: "Success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
  ]);
  return res.json({ users, events, bookings, revenue: revenue[0]?.total ?? 0 });
}

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
  return res.json({ users });
}

export async function updateUserRole(req: Request, res: Response) {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("name email role");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}
