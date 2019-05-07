const express = require("express");
const router = express.Router();
const config = require("../config");

const User = require("../models/users");
const { comparePassword } = require("../utils");
const jwt = require("jsonwebtoken");

const JWT_SECRET = config.JWT_SECRET;

/* GET home page. */
router.post("/", async function(req, res, next) {
    try {
        const user = await User.findOne({ phone: req.body.phone });
        if (!user) {
            return res.json({
                success: false,
                message: "Username/password invalid"
            });
        }

        const match = await comparePassword(req.body.password, user.password);
        if (match) {
            const { displayName } = user;
            const data = {
                displayName
            };
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 86400 * 14,
                    data
                },
                JWT_SECRET,
                { algorithm: "HS256" }
            );
            return res.json({
                success: true,
                message: "Login successful",
                token
            });
        }
        return status(401).json({
            success: false,
            message: "Username/password invalid"
        });
    } catch (err) {
        res.json({ success: false, message: err });
    }
});

module.exports = router;
