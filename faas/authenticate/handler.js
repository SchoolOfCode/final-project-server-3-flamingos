"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let appdb = false;

module.exports = (event, context) => {
    prepareDB().then(async () => {
        try {
            const user = await User.findOne({ phone: event.body.phone });
            if (!user) {
                return context
                    .headers({ "Content-Type": "application/json" })
                    .fail({
                        success: false,
                        message: "Username/password invalid"
                    });
            }
            const match = await comparePassword(
                event.body.password,
                user.password
            );
            if (match) {
                const { displayName } = user;
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
                return context
                    .headers({ "Content-Type": "application/json" })
                    .status(200)
                    .succeed({
                        success: true,
                        message: "Login successful",
                        token
                    });
            }
            return context
                .headers({ "Content-Type": "application/json" })
                .status(401)
                .fail({
                    success: false,
                    message: "Username/password invalid"
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

const comparePassword = (candidatePassword, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};
