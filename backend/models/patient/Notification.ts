import { Schema, model, Types } from "mongoose";
export interface INotification {
  userId: Types.ObjectId;
  message: string;
  level: "info" | "urgent";
  timeLabel?: string;
  read: boolean;
}
const schema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    level: { type: String, enum: ["info", "urgent"], default: "info" },
    timeLabel: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Notification = model<INotification>(
  "Notification",
  schema,
  "Notification"
);
