"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const Post = require("./post.model");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const twilio = require("twilio");
var accountSid = process.env.TWILIO_ACCOUNTSID;
var authToken = process.env.AUTH_TOKEN;
var twilioNumber = process.env.TWILIO_NUMBER;
var client = new twilio(accountSid, authToken);

let appdb;

module.exports = (event, context) => {
    prepareDB().then(async () => {
        let post = {};
        const { token, ...body } = event.body;
        const { data } = jwt.verify(token, `${process.env.JWT_SECRET}`);
        const user = await User.findOne({
            displayName: data.displayName
        });
        post = new Post({
            ...body,
            userId: user._id,
            postId: shortId.generate()
        });

        try {
            const result = await post.save();
            confirmPost(user.phone, post.postId);
            context
                .headers({ "Content-Type": "application/json" })
                .status(200)
                .succeed(result);
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

const confirmPost = (number, postId) => {
    client.messages
        .create({
            body: `Looks like you just made a post. Just checking it's you. Click here to confirm: https://watu.netlify.com/c/${postId}`,
            to: `${number}`, // Text this number
            from: `${twilioNumber}` // From a valid Twilio number
        })
        .then(message => console.log(message.sid));
};
