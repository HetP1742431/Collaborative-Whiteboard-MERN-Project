import mongoose, { Schema } from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["owner", "editor", "viewer"], required: true },
});

const whiteboardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [participantSchema],
  content: { type: Schema.Types.Mixed, default: [] },
  invitationCodes: [
    {
      code: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);
