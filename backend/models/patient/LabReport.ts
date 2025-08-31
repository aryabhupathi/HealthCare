import { Schema, model, Types } from "mongoose";
export interface ILabReport {
  patientId: Types.ObjectId;
  title: string;
  fileUrl: string;
}
const schema = new Schema<ILabReport>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);
export const LabReport = model<ILabReport>("LabReport", schema, "LabReport");
