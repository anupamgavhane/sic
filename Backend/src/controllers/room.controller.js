// const { model } = require('mongoose');
const roomModel=require('../models/room.model')

async function createRoom (req, res) {
  try {
    const {
      title,
      description,
      category,
      maxMembers,
      expiryTime
    } = req.body;

    // 🔴 Basic validation
    if (!title || !category || !maxMembers || !expiryTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (maxMembers < 2) {
      return res.status(400).json({ message: "Minimum 2 members required" });
    }

    if (new Date(expiryTime) <= new Date()) {
      return res.status(400).json({ message: "Expiry must be in the future" });
    }

    // 🔥 Create room
    const room = await roomModel.create({
      title,
      description,
      category,
      creator: req.user._id,   // from auth middleware
      members: [req.user._id], // creator auto-joins
      maxMembers,
      expiryTime
    });

    res.status(201).json({
      message: "Room created successfully",
      room
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function joinRoom(req, res) {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await roomModel.findOneAndUpdate(
      {
        _id: roomId,
        status: "active",
        expiryTime: { $gt: new Date() },
        members: { $ne: userId }, // not already joined
        $expr: { $lt: [{ $size: "$members" }, "$maxMembers"] }
      },
      {
        $push: { members: userId }
      },
      { new: true }
    );

    if (!room) {
      return res.status(400).json({
        message: "Cannot join (full/expired/already joined)"
      });
    }

    // 🔥 Check if now full
    if (room.members.length === room.maxMembers) {
      room.status = "full";
      await room.save();
    }

    res.status(200).json({
      message: "Joined successfully",
      room
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getRooms(req, res) {
  try {
    const { category } = req.query;

    const filter = {
      status: "active",
      expiryTime: { $gt: new Date() }
    };

    // 🔹 Optional category filter
    if (category) {
      filter.category = category;
    }

    const rooms = await roomModel
      .find(filter)
      .populate("creator", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: rooms.length,
      rooms
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getRoom(req, res) {
  try {
    const { roomId } = req.params;

    const room = await roomModel
      .findById(roomId)
      .populate("creator", "fullName email")
      .populate("members", "fullName email");

    // 🔴 Not found
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔴 Expired (optional but smart)
    if (room.expiryTime < new Date()) {
      room.status = "expired";
      await room.save();
    }

    res.status(200).json({ room });

  } catch (err) {
    console.error(err);

    // 🔴 Invalid ObjectId case
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
}

async function leaveRoom(req, res) {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await roomModel.findById(roomId);

    // 🔴 Room not found
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔴 Not a member
    if (!room.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member" });
    }

    // 🔥 Remove user
    room.members = room.members.filter(
      member => member.toString() !== userId.toString()
    );

    // 🔥 If creator leaves
    if (room.creator.toString() === userId.toString()) {
      if (room.members.length > 0) {
        // assign new creator (first member)
        room.creator = room.members[0];
      } else {
        // no members left → delete room
        await room.deleteOne();
        return res.status(200).json({ message: "Room deleted (no members left)" });
      }
    }

    // 🔥 If room was full, reopen it
    if (room.status === "full") {
      room.status = "active";
    }

    await room.save();

    res.status(200).json({
      message: "Left room successfully",
      room
    });

  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
}

async function removeUserFromRoom(req, res) {
  try {
    const currentUserId = req.user._id; // person making request
    const { roomId, userId } = req.params; // user to remove

    const room = await roomModel.findById(roomId);

    // 🔴 Room not found
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔴 Only creator allowed
    if (room.creator.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: "Only creator can remove users" });
    }

    // 🔴 User not in room
    const isMember = room.members.some(
      member => member.toString() === userId
    );

    if (!isMember) {
      return res.status(400).json({ message: "User not in room" });
    }

    // 🔴 Prevent removing creator (optional but recommended)
    if (room.creator.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove creator" });
    }

    // 🔥 Remove user
    room.members = room.members.filter(
      member => member.toString() !== userId
    );

    // 🔥 If room was full → reopen it
    if (room.status === "full") {
      room.status = "active";
    }

    await room.save();

    res.status(200).json({
      message: "User removed successfully",
      room
    });

  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
}

async function getMyRooms(req, res) {
  try {
    const userId = req.user._id;

    // 🔹 Fetch all user rooms
    const rooms = await roomModel
      .find({ members: userId })
      .populate("creator", "fullName email")
      .sort({ createdAt: -1 });

    // 🔹 Format + split
    const activeRooms = [];
    const pastRooms = [];

    rooms.forEach(room => {
      const isCreator =
        room.creator._id.toString() === userId.toString();

      const formattedRoom = {
        ...room.toObject(),
        isCreator
      };

      if (room.status === "expired") {
        pastRooms.push(formattedRoom);
      } else {
        activeRooms.push(formattedRoom);
      }
    });

    res.status(200).json({
      activeRooms,
      pastRooms
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteRoom(req, res) {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await roomModel.findById(roomId);

    // 🔴 Room not found
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔴 Only creator can delete
    if (room.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only creator can delete the room" });
    }

    await room.deleteOne();

    res.status(200).json({
      message: "Room deleted successfully"
    });

  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
}

async function editRoom(req, res) {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const updates = req.body;

    const room = await roomModel.findById(roomId);

    // 🔴 Room not found
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔴 Only creator can edit
    if (room.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only creator can edit the room" });
    }

    // 🔥 Validation

    // maxMembers cannot be less than current members
    if (updates.maxMembers && updates.maxMembers < room.members.length) {
      return res.status(400).json({
        message: "maxMembers cannot be less than current members"
      });
    }

    // expiry must be in future
    if (updates.expiryTime && new Date(updates.expiryTime) <= new Date()) {
      return res.status(400).json({
        message: "Expiry must be in the future"
      });
    }

    // 🔥 Apply updates
    Object.keys(updates).forEach(key => {
      room[key] = updates[key];
    });

    // 🔥 Update status if needed
    if (room.members.length >= room.maxMembers) {
      room.status = "full";
    } else if (room.status !== "expired") {
      room.status = "active";
    }

    await room.save();

    res.status(200).json({
      message: "Room updated successfully",
      room
    });

  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
}



module.exports = {createRoom,joinRoom,getRooms,getRoom,leaveRoom,removeUserFromRoom,getMyRooms,deleteRoom,editRoom}