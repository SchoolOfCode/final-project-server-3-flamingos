"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const Post = require("./post.model");
const User = require("./user.model");
let appdb;

module.exports = (event, context) => {
    prepareDB().then(async () => {
        if (event.body.postId) {
            try {
                const post = await Post.findOne({
                    postId: event.body.postId
                })
                    .populate("userId", "displayName")
                    .populate("comments.userId", "displayName");
                context
                    .headers({ "Content-Type": "application/json" })
                    .status(200)
                    .succeed(post);
            } catch (err) {
                context
                    .headers({ "Content-Type": "application/json" })
                    .fail(err.toString());
            }
        } else {
            try {
                const dateNow = new Date();
                const searchDate = dateNow.setHours(dateNow.getHours() - 1);
                const post = await Post.find({
                    confirmed: true,
                    updatedAt: { $gte: searchDate }
                })
                    .populate("userId", "displayName")
                    .populate("comments.userId", "displayName");
                context
                    .headers({ "Content-Type": "application/json" })
                    .status(200)
                    .succeed(post);
            } catch (err) {
                context
                    .headers({ "Content-Type": "application/json" })
                    .fail(err.toString());
            }
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
