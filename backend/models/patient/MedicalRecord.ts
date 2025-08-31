import mongoose, { Schema, Document } from "mongoose";
export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  type: "prescription" | "lab-report" | "diagnosis" | "other";
  description: string;
  fileUrl?: string;
  date: Date;
}
const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
    },
    doctorId: { type: Schema.Types.ObjectId, ref: "DoctorProfile" },
    type: {
      type: String,
      enum: ["prescription", "lab-report", "diagnosis", "other"],
      required: true,
    },
    description: { type: String, required: true },
    fileUrl: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model<IMedicalRecord>(
  "MedicalRecord",
  MedicalRecordSchema,
  "MedicalRecord"
);
