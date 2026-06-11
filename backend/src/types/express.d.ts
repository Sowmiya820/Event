import type { Types } from "mongoose";

export type UserRole = "user" | "organizer" | "admin";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: UserRole;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export interface RefId {
  _id: Types.ObjectId;
}
