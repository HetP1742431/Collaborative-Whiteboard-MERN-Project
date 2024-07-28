import express from "express";
import { Whiteboard } from "../models/whiteboard.model.js";
import { User } from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

export default router;
