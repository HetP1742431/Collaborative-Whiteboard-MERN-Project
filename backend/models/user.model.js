import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    whiteboards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Whiteboard" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
