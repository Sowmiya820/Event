import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import type { UserRole } from "../types/express.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; role: UserRole };
    const user = await User.findById(payload.id).select("role");
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    req.user = { id: payload.id, role: user.role as UserRole };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Insufficient permissions" });
    return next();
  };
}
