import mongoose, { Schema, Document } from "mongoose";
export interface IAvailability {
  day: string;
  slots: { start: string; end: string }[];
}
export interface IDocument {
  type: string;
  url: string;
  verified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
}
export interface IRating {
  patientId: mongoose.Types.ObjectId;
  score: number;
  comment?: string;
  createdAt: Date;
}
export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  specialization: string[];
  department: string;
  experience: number;
  licenseNumber: string;
  licenseExpiry: Date;
  photo?: string;
  availability: IAvailability[];
  consultationDuration: number;
  bufferTime: number;
  consultationFee: number;
  status: "active" | "suspended" | "retired" | "pending";
  statusHistory: { status: string; reason?: string; changedAt: Date }[];
  assignedPatients: mongoose.Types.ObjectId[];
  documents: IDocument[];
  ratings: IRating[];
  averageRating: number;
  languages: string[];
  hospitalAffiliation?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const DoctorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: "text" },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, match: /^[0-9]{10}$/, index: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    specialization: [{ type: String, index: true }],
    department: { type: String, index: true },
    experience: { type: Number, min: 0, max: 60 },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiry: { type: Date, required: true },
    photo: { type: String, default: "/images/default-doctor.png" },
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        slots: [{ start: String, end: String }],
      },
    ],
    consultationDuration: { type: Number, default: 30 },
    bufferTime: { type: Number, default: 5 },
    consultationFee: { type: Number, min: 0, default: 500 },
    status: {
      type: String,
      enum: ["active", "suspended", "retired", "pending"],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["active", "suspended", "retired", "pending"],
        },
        reason: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
    assignedPatients: [{ type: Schema.Types.ObjectId, ref: "Patient" }],
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
        verifiedAt: { type: Date },
      },
    ],
    ratings: [
      {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
        score: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    languages: [{ type: String }],
    hospitalAffiliation: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
DoctorSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    this.averageRating =
      this.ratings.reduce((acc, r) => acc + r.score, 0) / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});
export default mongoose.model<IDoctor>("Doctor", DoctorSchema, "Doctor");
