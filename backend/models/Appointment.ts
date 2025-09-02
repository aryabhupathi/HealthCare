import mongoose, { Schema, Document } from "mongoose";
export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  department: string;
  date: Date;
  slot: { start: string; end: string };
  duration: number;
  status:
    | "pending"
    | "confirmed"
    | "rescheduled"
    | "completed"
    | "cancelled"
    | "no-show";
  consultationType: "online" | "in-person";
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod?: "cash" | "card" | "insurance" | "upi";
  invoiceId?: mongoose.Types.ObjectId;
  reasonForVisit?: string;
  cancelReason?: string;
  rescheduleHistory?: {
    previousSlot: { start: string; end: string };
    newSlot: { start: string; end: string };
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
const AppointmentSchema: Schema = new Schema<IAppointment>(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    slot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    duration: { type: Number, default: 30 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rescheduled",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
    },
    consultationType: {
      type: String,
      enum: ["online", "in-person"],
      default: "in-person",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "insurance", "upi"],
    },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    reasonForVisit: { type: String },
    cancelReason: { type: String },
    rescheduleHistory: [
      {
        previousSlot: { start: String, end: String },
        newSlot: { start: String, end: String },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    notes: { type: String },
  },
  { timestamps: true }
);
export default mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema,
  "Appointment"
);
