const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("../config");
const JWT_SECRET = config.JWT_SECRET;

//GET *get all posts*
router.get("/", async (req, res, next) => {
    try {
        const posts = await Post.find({}).populate("userId", "displayName");
        res.status(200).json({ payload: posts });
    } catch (err) {
        console.error("Can't find posts", err);
    }
});

//GET *get one posts*
router.get("/:id", async (req, res, next) => {
    try {
        const posts = await Post.find({ postId: req.params.id }).populate(
            "userId",
            "displayName"
        );
        res.status(200).json({ payload: posts });
    } catch (err) {
        console.error("Can't find posts", err);
    }
});

//POST *make new post*
router.post("/", async (req, res, next) => {
    const { data } = jwt.verify(req.query.token, JWT_SECRET);
    const userId = await User.findOne({
        displayName: data.displayName
    });
    try {
        const post = new Post({ ...req.body, userId });
        await post.save();
        res.status(201).json({ payload: post });
    } catch (err) {
        console.error("New post fail!", err);
    }
});

module.exports = router;
