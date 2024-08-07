import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use routes
app.use("/users", userRoutes);
app.use("/whiteboards", whiteboardRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

// Socket.IO configuration
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinWhiteboard", (whiteboardId) => {
    socket.join(whiteboardId);
    console.log(`Client ${socket.id} joined whiteboard ${whiteboardId}`);
  });

  socket.on("draw", (data) => {
    socket.to(data.whiteboardId).emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Connect and listen to PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
