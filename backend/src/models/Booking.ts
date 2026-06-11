import mongoose, { Schema, type InferSchemaType } from "mongoose";

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Confirmed", "Cancelled"], default: "Confirmed" },
    confirmationCode: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, event: 1 });

export type BookingDocument = InferSchemaType<typeof bookingSchema>;
export const Booking = mongoose.model("Booking", bookingSchema);
