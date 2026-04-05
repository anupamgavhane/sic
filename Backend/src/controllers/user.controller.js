const userModel = require("../models/user.model");

async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).select("fullName email lastActive createdAt isVerified");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getUserProfile,
};
