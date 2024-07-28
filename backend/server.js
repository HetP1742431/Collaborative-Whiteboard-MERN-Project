import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const options = {
  origin: "http://localhost:5173",
};

// Middleware
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// TODO: Review Socket.IO configuration
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinWhiteboard", (whiteboardId) => {
    socket.join(whiteboardId);
    console.log(`Client ${socket.id} joined whiteboard ${whiteboardId}`);
  });

  socket.on("draw", (data) => {
    io.to(data.whiteboardId).emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Root route for homepage
app.get("/", (req, res) => {
  res.send("Welcome to the real-time collaborative whiteboard!");
});

// Connect and listen to PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
