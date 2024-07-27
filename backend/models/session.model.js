import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  whiteboard: {
    type: Schema.Types.ObjectId,
    ref: "Whiteboard",
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Session = mongoose.model("Session", sessionSchema);
