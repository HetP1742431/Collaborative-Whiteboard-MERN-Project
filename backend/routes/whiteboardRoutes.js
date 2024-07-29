import express from "express";
import { Whiteboard } from "../models/whiteboard.model.js";
import { User } from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create a new whiteboard
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  const username = req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newWhiteboard = new Whiteboard({
      title,
      owner: username,
      participants: [{ user: username, role: "owner" }],
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

// Get all whiteboards for specific user
router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      "whiteboards"
    );
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

// Share whiteboard
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

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    // Add recipient to whiteboard participants
    whiteboard.participants.push({ user: recipient._id, role });
    await whiteboard.save();

    // Add whiteboard to recipients's whiteboards
    recipient.whiteboards.push(whiteboard._id);
    await recipient.save();

    res.json({ message: "Whiteboard shared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Join the existing whiteboard
router.post("/join", authMiddleware, async (req, res) => {
  const { whiteboardId, role } = req.body;
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

    // Check if user is already a participant
    if (
      whiteboard.participants.some(
        (p) => p.user.toString() === user._id.toString()
      )
    ) {
      return res.status(400).json({ msg: "User already a participant" });
    }

    // Add user to whiteboard participants
    whiteboard.participants.push({ user: user._id, role });
    await whiteboard.save();

    // Add whiteboard to user's whiteboards
    user.whiteboards.push(whiteboard._id);
    await user.save();

    res.json({ message: "Joined whiteboard successfully" });
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

    await whiteboard.remove();
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

// Share whiteboard
router.post("/:username/share", authMiddleware, (req, res) => {});
export default router;
