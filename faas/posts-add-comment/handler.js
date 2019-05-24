"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const Post = require("./post.model");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const io = require("socket.io-client");
let appdb = false;
const socket = io(process.env.SOCKETS, { transports: ["websocket"] });

module.exports = (event, context) => {
    prepareDB().then(async () => {
        const { token, ...body } = event.body;
        const { data } = jwt.verify(token, `${process.env.JWT_SECRET}`);
        const user = await User.findOne({
            displayName: data.displayName
        });
        try {
            if (body.comment) {
                const newComment = {
                    userId: user._id,
                    comment: body.comment,
                    date: body.date
                };
                const post = await Post.findOneAndUpdate(
                    {
                        postId: body.postId
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
                socket.emit("comment", { [post.postId]: post });
                context
                    .headers({ "Content-Type": "application/json" })
                    .status(200)
                    .succeed(post);
            }
        } catch (err) {
            context
                .headers({ "Content-Type": "application/json" })
                .fail(err.toString());
        }
    });
};

const prepareDB = () => {
    const url = `mongodb+srv://app:${process.env.MONGO_PW}@${
        process.env.MONGO_ID
    }.mongodb.net/app?retryWrites=true`;
    return new Promise(async (resolve, reject) => {
        if (appdb) {
            console.log("mongoose: connected.");
            return resolve(appdb);
        } else {
            try {
                console.log(" mongoose: connecting...");
                await mongoose.connect(url, {
                    useNewUrlParser: true,
                    useFindAndModify: false,
                    poolSize: 5
                });
                appdb = mongoose.connection;
                return resolve(appdb);
            } catch (err) {
                return reject(err);
            }
        }
    });
};
