import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

function signToken(id: string, role: string) {
  return jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function sanitizeUser(user: any) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req: Request, res: Response) {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) return res.status(409).json({ message: "Email is already registered" });

  const user = await User.create(req.body);
  const token = signToken(user.id, user.role);
  return res.status(201).json({ token, user: sanitizeUser(user) });
}

export async function login(req: Request, res: Response) {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await (user as any).comparePassword(req.body.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user.id, user.role);
  return res.json({ token, user: sanitizeUser(user) });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.user?.id);
  return res.json({ user: sanitizeUser(user) });
}
