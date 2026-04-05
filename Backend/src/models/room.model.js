const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      enum: ["ride", "food", "ecommerce", "grocery", "other"],
      required: true,
      index: true
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    maxMembers: {
      type: Number,
      required: true
    },

    expiryTime: {
      type: Date,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["active", "full", "expired"],
      default: "active",
      index: true
    }
  },
  { timestamps: true }
);

const roomModel = mongoose.model("Room", roomSchema);

module.exports = roomModel;