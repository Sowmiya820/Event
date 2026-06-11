import crypto from "crypto";
import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";
import { Payment } from "../models/Payment.js";
import { stripe } from "../utils/stripe.js";

export async function createPaymentIntent(req: Request, res: Response) {
  const { eventId, quantity } = req.body;
  const event = await Event.findById(eventId);
  if (!event || event.status !== "published") return res.status(404).json({ message: "Event not found" });
  if (event.availableTickets < quantity) return res.status(400).json({ message: "Not enough tickets available" });

  const totalAmount = event.ticketPrice * quantity;
  const amountInSmallestUnit = Math.round(totalAmount * 100);
  const intent = await stripe.paymentIntents.create({
    amount: amountInSmallestUnit,
    currency: env.CURRENCY,
    automatic_payment_methods: { enabled: true },
    metadata: { eventId, userId: req.user?.id ?? "", quantity: String(quantity) }
  });

  const payment = await Payment.create({
    user: req.user?.id,
    event: eventId,
    providerPaymentIntentId: intent.id,
    amount: totalAmount,
    currency: env.CURRENCY,
    status: "Pending"
  });

  return res.status(201).json({ clientSecret: intent.client_secret, paymentId: payment.id, paymentIntentId: intent.id });
}

export async function confirmBooking(req: Request, res: Response) {
  const { paymentIntentId } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const payment = await Payment.findOne({ providerPaymentIntentId: paymentIntentId });

  if (!payment) return res.status(404).json({ message: "Payment record not found" });
  if (payment.user.toString() !== req.user?.id) return res.status(403).json({ message: "Not allowed" });

  if (paymentIntent.status !== "succeeded") {
    payment.status = paymentIntent.status === "requires_payment_method" ? "Failed" : "Pending";
    await payment.save();
    return res.status(400).json({ message: "Payment has not succeeded", status: payment.status });
  }

  const existingBooking = await Booking.findOne({ payment: payment._id });
  if (existingBooking) return res.json({ booking: existingBooking });

  const quantity = Number(paymentIntent.metadata.quantity || 1);
  const event = await Event.findOneAndUpdate(
    { _id: payment.event, availableTickets: { $gte: quantity } },
    { $inc: { availableTickets: -quantity } },
    { new: true }
  );
  if (!event) return res.status(400).json({ message: "Not enough tickets available" });

  payment.status = "Success";
  await payment.save();

  const booking = await Booking.create({
    user: req.user?.id,
    event: payment.event,
    payment: payment._id,
    quantity,
    totalAmount: payment.amount,
    confirmationCode: crypto.randomBytes(5).toString("hex").toUpperCase()
  });

  return res.status(201).json({ booking });
}

export async function myBookings(req: Request, res: Response) {
  const bookings = await Booking.find({ user: req.user?.id })
    .populate("event")
    .populate("payment")
    .sort({ createdAt: -1 });
  return res.json({ bookings });
}

export async function getBooking(req: Request, res: Response) {
  const booking = await Booking.findById(req.params.id).populate("event").populate("payment");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.user.toString() !== req.user?.id && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }
  return res.json({ booking });
}
