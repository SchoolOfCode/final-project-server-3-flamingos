const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  imageUrl: String, //url
  imageId: String,
  description: String,
  longitude: Number,
  latitute: Number,
  postCategory: String
});

module.exports = mongoose.model("Post", postSchema);
