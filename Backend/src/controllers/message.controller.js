const messageModel = require("../models/message.model");

async function getMessages(req, res) {
  try {
    const { roomId } = req.params;

    const messages = await messageModel.find({ roomId })
      .populate("sender", "fullName email")
      .sort({ createdAt: 1 });

    res.json({ messages });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports={getMessages};