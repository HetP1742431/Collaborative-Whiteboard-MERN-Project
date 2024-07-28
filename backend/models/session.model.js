import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  whiteboard: {
    type: Schema.Types.ObjectId,
    ref: "Whiteboard",
    required: true,
  },
  activeParticipants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const Session = mongoose.model("Session", sessionSchema);
