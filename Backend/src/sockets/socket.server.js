const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const roomModel = require("../models/room.model");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173","https://sic-gules.vercel.app/"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("No cookie"));
      }

      // Parse cookies properly (handles multiple cookies)
      const cookies = {};
      cookieHeader.split(";").forEach((c) => {
        const [key, ...val] = c.trim().split("=");
        cookies[key] = val.join("=");
      });

      const token = cookies.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      // 🔥 attach user to socket
      socket.user = user;

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    //  JOIN ROOM EVENT
    socket.on("joinRoom", async (roomId) => {
      try {
        console.log("Join request for room:", roomId);

        //  Validate room exists
        const room = await roomModel.findById(roomId);

        if (!room) {
          return socket.emit("error", "Room not found");
        }

        //  Validate user is member
        //  For now we don’t have socket auth yet
        // so this is temporary (we’ll fix in next step)

        // TEMP: allow join (we'll secure later)
        const isMember = room.members.some(
          (m) => m.toString() === socket.user._id.toString(),
        );

        if (!isMember) {
          return socket.emit("error", "Not a member");
        }
        socket.join(roomId);

        console.log(` Socket ${socket.id} joined room ${roomId}`);

        socket.emit("joinedRoom", roomId);
      } catch (err) {
        console.error(err);
        socket.emit("error", "Failed to join room");
      }
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, text } = data || {};

        const newMessage = await messageModel.create({
          roomId: roomId,
          sender: socket.user._id,
          text: text,
        });

        const populatedMessage = await newMessage.populate(
          "sender",
          "fullName email",
        );

        io.to(roomId).emit("newMessage", {
          _id: populatedMessage._id,
          text: populatedMessage.text,
          sender: populatedMessage.sender,
          createdAt: populatedMessage.createdAt,
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initSocketServer;
