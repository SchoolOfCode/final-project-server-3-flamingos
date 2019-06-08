const mongoose = require("mongoose");
const shortId = require("shortid");

const commentSchema = new mongoose.Schema({
    comment: String,
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const postSchema = new mongoose.Schema(
    {
        confirmed: { type: Boolean, default: false },
        postId: { type: String, default: shortId.generate },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        imageUrl: String,
        imageId: String,
        description: String,
        longitude: Number,
        latitude: Number,
        postCategory: String,
        comments: [commentSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
