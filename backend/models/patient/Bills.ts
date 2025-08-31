import mongoose, { Schema, Document } from "mongoose";
export interface IBilling extends Document {
  patientId: mongoose.Types.ObjectId;
  amount: number;
  status: "paid" | "pending" | "overdue";
  description?: string;
}
const BillingSchema = new Schema<IBilling>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
    description: String,
  },
  { timestamps: true }
);
export default mongoose.model<IBilling>("Billing", BillingSchema, "Bill");
