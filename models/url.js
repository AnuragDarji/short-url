const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistroy: [
      {
        timestamp: { type: Number },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to users collection
      required: true,
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;