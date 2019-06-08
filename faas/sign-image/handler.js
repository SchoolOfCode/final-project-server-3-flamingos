"use strict";
const cloudinary = require("cloudinary");

module.exports = (event, context) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        { timestamp: timestamp },
        process.env.CLOUD_SECRET
    );
    const payload = {
        signature: signature,
        timestamp: timestamp
    };

    context.status(200).succeed(payload);
};
