import mongoose, { Schema, Document } from "mongoose";
export interface IPatient extends Document {
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  bloodGroup: string;
  medicalHistory: string[];
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  department: string;
  status: "Active" | "Discharged";
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
const PatientSchema: Schema = new Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    bloodGroup: { type: String, required: true },
    medicalHistory: [{ type: String }],
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    medications: [{ type: String }],
    department: { type: String, required: true },
    status: { type: String, enum: ["Active", "Discharged"], default: "Active" },
    insuranceProvider: { type: String },
    insuranceNumber: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IPatient>("Patient", PatientSchema, "Patient");
