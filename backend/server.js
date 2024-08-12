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
    origin: "https://collaborative-whiteboard-app.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "https://collaborative-whiteboard-app.onrender.com",
    credentials: true,
  })
);
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
const activeUsers = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinWhiteboard", ({ whiteboardId, username }) => {
    socket.join(whiteboardId);

    if (!activeUsers[whiteboardId]) {
      activeUsers[whiteboardId] = new Set();
    }

    activeUsers[whiteboardId].add(socket.id);

    io.to(whiteboardId).emit(
      "updateActiveUsers",
      activeUsers[whiteboardId].size
    );

    console.log(`User ${username} joined whiteboard ${whiteboardId}`);
  });

  socket.on("leaveWhiteboard", ({ whiteboardId }) => {
    if (activeUsers[whiteboardId]) {
      activeUsers[whiteboardId].delete(socket.id);
      io.to(whiteboardId).emit(
        "updateActiveUsers",
        activeUsers[whiteboardId].size
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    for (const whiteboardId in activeUsers) {
      if (activeUsers[whiteboardId].has(socket.id)) {
        activeUsers[whiteboardId].delete(socket.id);
        io.to(whiteboardId).emit(
          "updateActiveUsers",
          activeUsers[whiteboardId].size
        );
      }
    }
  });

  socket.on("sendMessage", (message) => {
    const { whiteboardId, sender, text } = message;
    io.to(whiteboardId).emit("chatMessage", { sender, text });
  });

  socket.on("draw", (data) => {
    socket.to(data.whiteboardId).emit("draw", data);
  });
});

// Connect and listen to PORT
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
