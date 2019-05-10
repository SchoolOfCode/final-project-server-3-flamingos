const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { upload } = require("../utils");
const JWT_SECRET = config.JWT_SECRET;

//GET *get all posts*
router.get("/", async (req, res, next) => {
    try {
        const posts = await Post.find({})
            .populate("userId", "displayName")
            .populate("comments.userId", "displayName");
        res.status(200).json({ payload: posts });
    } catch (err) {
        console.error("Can't find posts", err);
    }
});

//GET *get one posts*
router.get("/:id", async (req, res, next) => {
    try {
        const posts = await Post.find({ postId: req.params.id })
            .populate("userId", "displayName")
            .populate("comments.userId", "displayName");
        res.status(200).json({ payload: posts });
    } catch (err) {
        console.error("Can't find posts", err);
    }
});

//POST *make new post*
router.post("/", upload.single("file"), async (req, res, next) => {
    const { data } = jwt.verify(req.query.token, JWT_SECRET);
    const userId = await User.findOne({
        displayName: data.displayName
    });

    try {
        let post = new Post({});

        if (req.file) {
            // const imageId = req.file.public_id;
            // const imageUrl = req.file.secure_url;
            post = new Post({
                ...req.body,
                userId,
                imageUrl: req.file.secure_url,
                imageId: req.file.public_id
            });
        } else {
            post = new Post({ ...req.body, userId });
        }

        await post.save();
        res.status(201)
            .json({ payload: post })
            .populate("userId", "displayName")
            .populate("comments.userId", "displayName");
    } catch (err) {
        console.error("New post fail!", err);
    }
});

//PATCH *to add comments*
router.patch("/:id", async (req, res, next) => {
    const { data } = jwt.verify(req.query.token, JWT_SECRET);
    const userId = await User.findOne({
        displayName: data.displayName
    });
    if (req.body.comment) {
        const newComment = {
            userId: userId,
            comment: req.body.comment,
            date: req.body.date
        };
        const post = await Post.findOneAndUpdate(
            {
                postId: req.params.id
            },
            {
                $push: {
                    comments: newComment
                }
            },
            { new: true }
        )
            .populate("userId", "displayName")
            .populate("comments.userId", "displayName");
        res.status(200).json({ success: true, payload: post });
    }
});

module.exports = router;
