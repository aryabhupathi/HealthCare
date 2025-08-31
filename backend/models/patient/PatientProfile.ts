import mongoose, { Schema, Document } from "mongoose";
export interface IPatientProfile extends Document {
  userId: mongoose.Types.ObjectId;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup?: string;
  medicalHistory?: string[];
}
const PatientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: Number,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: String,
    medicalHistory: [String],
  },
  { timestamps: true }
);
export default mongoose.model<IPatientProfile>(
  "PatientProfile",
  PatientProfileSchema,
  "PatientProfile"
);
