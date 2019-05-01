const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  imageUpload: String, //url
  imageId: String,
  description: String,
  location: { longtitude: { type: Number, latitute: Number } },
  postCategory: String
});

module.exports = mongoose.model("Post", postSchema);
