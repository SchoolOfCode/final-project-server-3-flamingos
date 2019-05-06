const mongoose = require("mongoose");
const shortId = require("shortid");

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: String, default: shortId.generate },
    imageUrl: String, //url
    imageId: String,
    description: String,
    longitude: Number,
    latitute: Number,
    postCategory: String
});

module.exports = mongoose.model("Post", postSchema);
