"use strict";

const mongoose = require("mongoose"),
    assert = require("assert");
const User = require("./user.model");
let appdb;

module.exports = (event, context) => {
    prepareDB().then(async () => {
        try {
            const user = await User.findOne({ phone: event.body.phone })
                .select("_id")
                .lean();
            if (user) {
                context
                    .headers({ "Content-Type": "application/json" })
                    .status(307)
                    .fail({ message: "Number exists" });
            } else {
                const user = new User(event.body);
                await user.save();
                return context
                    .headers({ "Content-Type": "application/json" })
                    .status(201)
                    .succeed({ payload: user, message: "User created" });
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
