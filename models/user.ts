import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String },
    subject: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
