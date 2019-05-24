"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
let appdb;

module.exports = (event, context) => {
    prepareDB().then(async () => {
        const { token, ...body } = event.body;
        const { data } = jwt.verify(token, `${process.env.JWT_SECRET}`);
        const user = await User.findOne({
            displayName: data.displayName
        });
        try {
            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: user._id
                },
                {
                    ...body
                },
                { new: true }
            );
            const { displayName } = updatedUser;
            const data = {
                displayName
            };
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 1209600,
                    data
                },
                process.env.JWT_SECRET,
                { algorithm: "HS256" }
            );
            context
                .headers({ "Content-Type": "application/json" })
                .status(200)
                .succeed({
                    message: "Profile updated",
                    payload: updatedUser,
                    token
                });
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
