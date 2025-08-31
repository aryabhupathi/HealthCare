import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
  },
  { timestamps: true }
);
export default mongoose.model<IUser>("User", userSchema, "User");
