import express from "express";
import crypto from "crypto";
import { Whiteboard } from "../models/whiteboard.model.js";
import { User } from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create a new whiteboard
router.post("/create", authMiddleware, async (req, res) => {
  const { title } = req.body;
  const username = req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newWhiteboard = new Whiteboard({
      title,
      owner: user._id,
      participants: [{ user: user._id, role: "owner" }],
    });
    const savedWhiteboard = await newWhiteboard.save();

    // Add whiteboard to user's whiteboards
    user.whiteboards.push(savedWhiteboard._id);
    await user.save();

    res.json(savedWhiteboard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch whiteboard data with access control
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const username = req.user.username;

  try {
    const whiteboard = await Whiteboard.findById(id).populate(
      "participants.user",
      "username"
    );

    if (!whiteboard) {
      return res.status(404).json({ error: "Whiteboard not found" });
    }

    const isParticipant = whiteboard.participants.some(
      (participant) => participant.user.username === username
    );

    if (!isParticipant) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all whiteboards for specific user
router.get("/:username", authMiddleware, async (req, res) => {
  const username = req.user.username;
  try {
    const user = await User.findOne({ username }).populate("whiteboards");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.username !== req.user.username) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(user.whiteboards);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Share whiteboard (generate sharable link/code)
router.post("/:id/share", authMiddleware, async (req, res) => {
  const { role, recipientEmail } = req.body;
  const whiteboardId = req.params.id;
  const username = req.user.username;

  try {
    const owner = await User.findOne({ username });
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }

    const whiteboard = await Whiteboard.findById(whiteboardId);
    if (!whiteboard) {
      return res.status(404).json({ error: "Whiteboard not found" });
    }

    if (whiteboard.owner.toString() !== owner._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Generate a unique code for sharing
    const shareCode = crypto.randomBytes(20).toString("hex");

    // Add the share code to the whiteboard
    whiteboard.invitationCodes.push({
      code: shareCode,
      email: recipientEmail,
      role,
    });
    await whiteboard.save();

    res.json({
      shareCode,
      message:
        "Share this code/link with the intended user to join the whiteboard",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Join the existing whiteboard
router.post("/join", authMiddleware, async (req, res) => {
  const { shareCode } = req.body;
  const username = req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the whiteboard with the matching share code
    const whiteboard = await Whiteboard.findOne({
      "invitationCodes.code": shareCode,
    });
    if (!whiteboard) {
      return res.status(404).json({ error: "Invalid invitation code" });
    }

    // Find the invitation entry
    const invitation = whiteboard.invitationCodes.find(
      (invite) => invite.code === shareCode
    );

    // Check if the invitation email matches the user's email or if the invitation is for an unregistered user
    if (
      invitation.email !== user.email &&
      invitation.email !== "unregistered"
    ) {
      return res
        .status(403)
        .json({ error: "This invitation is not intended for you" });
    }

    // Check if user is already a participant
    if (
      whiteboard.participants.some(
        (p) => p.user.toString() === user._id.toString()
      )
    ) {
      return res.status(400).json({ msg: "User already a participant" });
    }

    // Add user to whiteboard participants
    whiteboard.participants.push({ user: user._id, role: invitation.role });
    await whiteboard.save();

    // Add whiteboard to user's whiteboards
    user.whiteboards.push(whiteboard._id);
    await user.save();

    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete whiteboard
router.delete("/:id", authMiddleware, async (req, res) => {
  const whiteboardId = req.params.id;
  const username = req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const whiteboard = await Whiteboard.findById(whiteboardId);
    if (!whiteboardId) {
      return res.status(404).json({ error: "Whiteboard not found" });
    }

    if (whiteboard.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Delete whiteboard from every participant's document
    await User.updateMany(
      { _id: { $in: whiteboard.participants.map((p) => p.user) } },
      { $pull: { whiteboards: whiteboardId } }
    );

    // Delete the whiteboard
    await Whiteboard.deleteOne({ _id: whiteboardId });

    res.json({ message: "Whiteboard deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Change participant's role
router.patch("/:id/role", authMiddleware, async (req, res) => {
  const { participantId, newRole } = req.body;
  const whiteboardId = req.params.id;
  const username = req.user.username;

  try {
    const owner = await User.findOne({ username });
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }

    const whiteboard = await Whiteboard.findById(whiteboardId);
    if (!whiteboard) {
      return res.status(404).json({ msg: "Whiteboard not found" });
    }

    if (whiteboard.owner.toString() !== owner._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const participant = whiteboard.participants.find(
      (p) => p.user.toString() === participantId
    );
    if (!participant) {
      return res.status(404).json({ msg: "Participant not found" });
    }

    participant.role = newRole;
    await whiteboard.save();

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
});

export default router;
