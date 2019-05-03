const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

//GET *get all posts*
router.get("/", async (req, res, next) => {
    try {
        const posts = await Post.find({}).populate("userId", "displayName");
        res.status(200).json({ payload: posts });
    } catch (err) {
        console.error("Can't find posts", err);
    }
});

//POST *make new post*
router.post("/", async (req, res, next) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json({ payload: post });
    } catch (err) {
        console.error("New post fail!", err);
    }
});

module.exports = router;
