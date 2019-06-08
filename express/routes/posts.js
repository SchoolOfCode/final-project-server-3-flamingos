const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { upload } = require("../utils");
const { confirmPost } = require("../utils");
const JWT_SECRET = config.JWT_SECRET;

// sockets stuff
const http = require("http").Server(express);
const io = require("socket.io")(http);

//GET *get all posts*
router.get("/", async (req, res, next) => {
    try {
        const posts = await Post.find({
            confirmed: true
        })
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
            //send confirmation and await response before passing on to cloudinary and mongo
            //on Confirm, send confirmation to mongo....change userId.confirmed = true
            //findConfirmation
            //then execute live update
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
        confirmPost(userId.phone, post.postId);
        res.status(201).json({ payload: post });
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
        io.emit(`${req.params.id}`, post);
        res.status(200).json({ success: true, payload: post });
    }
});

//PATCH *to confirm a post*
router.patch(
    "/c/:id",
    async (req, res, next) => {
        const { data } = jwt.verify(req.query.token, JWT_SECRET);
        const userId = await User.findOne({
            displayName: data.displayName
        });
        const post = await Post.findOneAndUpdate(
            {
                postId: req.params.id
            },
            {
                confirmed: true
            },

            { new: true }
        )
            .populate("userId", "displayName")
            .populate("comments.userId", "displayName");
        io.emit(`${req.params.id}`, post);
        res.status(200).json({ success: true, payload: post });
    }

    //UPDATE LIVE PAGE WITH NEW POST

    // get the post id from url params
    // find in the DB, findOneAndUpdate
    // set the confirmed to true
);

// start sockets and log connection/disconnection
io.on("connection", function(socket) {
    console.log("SOCKET /posts user connected");
    socket.on("post", function(msg) {
        io.emit("post", msg);
    });
    socket.on("disconnect", function() {
        console.log("SOCKET /posts user disconnected");
    });
});

http.listen(process.env.SOCKET, function() {
    console.log(`socket on :${process.env.SOCKET}`);
});

module.exports = router;
