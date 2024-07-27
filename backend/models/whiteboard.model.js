import mongoose, { Schema } from "mongoose";

const whiteboardSchema = new mongoose.Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  content: { type: Schema.Types.Mixed, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);
