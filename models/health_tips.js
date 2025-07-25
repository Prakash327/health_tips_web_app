const mongoose = require("mongoose");
const health_tips_Schema = new mongoose.Schema(
  {
    firebaseUid: {
      index: true,
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },
    content: {
      type: String,
      required: [true, "content is required"],
      minlength: [5, "Name must be at least 2 characters"],
      maxlength: [500, "Name must be at most 50 characters"],
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "Share" }],
  },
  { timestamps: true }
);

const healthTips = mongoose.model("health_tips", health_tips_Schema);
module.exports = healthTips;
