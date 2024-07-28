import mongoose, { Schema } from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["read", "edit"], required: true },
});

const whiteboardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [participantSchema],
  content: { type: Schema.Types.Mixed, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);
