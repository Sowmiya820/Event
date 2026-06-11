import mongoose, { Schema, type InferSchemaType } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    provider: { type: String, enum: ["stripe"], default: "stripe" },
    providerPaymentIntentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" }
  },
  { timestamps: true }
);

export type PaymentDocument = InferSchemaType<typeof paymentSchema>;
export const Payment = mongoose.model("Payment", paymentSchema);
