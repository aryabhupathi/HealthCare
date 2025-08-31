import mongoose, { Schema, Document } from "mongoose";
export interface IDoctorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  experience: number;
  licenseNumber: string;
  qualifications?: string[];
  availability?: {
    days: string[];
    timeSlots: string[];
  };
}
const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    licenseNumber: { type: String, required: true },
    qualifications: [String],
    availability: {
      days: [String],
      timeSlots: [String],
    },
  },
  { timestamps: true }
);
export default mongoose.model<IDoctorProfile>(
  "DoctorProfile",
  DoctorProfileSchema,
  "DoctorProfile"
);
