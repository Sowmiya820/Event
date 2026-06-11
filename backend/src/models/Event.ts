import mongoose, { Schema, type InferSchemaType } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 5000 },
    category: { type: String, required: true, trim: true, index: true },
    imageUrl: { type: String, default: "" },
    venue: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalTickets: { type: Number, required: true, min: 1 },
    availableTickets: { type: Number, required: true, min: 0 },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published", "cancelled"], default: "published" }
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text", city: "text", category: "text" });

export type EventDocument = InferSchemaType<typeof eventSchema>;
export const Event = mongoose.model("Event", eventSchema);
