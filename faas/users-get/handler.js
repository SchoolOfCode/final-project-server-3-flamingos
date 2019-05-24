"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
let appdb;

module.exports = (event, context) => {
    prepareDB().then(async () => {
        try {
            const { token } = event.body;
            const { data } = jwt.verify(token, `${process.env.JWT_SECRET}`);
            const user = await User.findOne({
                displayName: data.displayName
            });
            return context
                .headers({ "Content-Type": "application/json" })
                .status(200)
                .succeed(user);
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
