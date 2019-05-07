const express = require("express");
const router = express.Router();
const User = require("../models/users"); // sign up new user

/* POST user */

router.post("/", async (req, res, next) => {
    try {
        const user = await User.findOne({ phone: req.body.phone })
            .select("_id")
            .lean();
        //if number already exists, redirect to login page
        if (user) {
            res.status(307).json({ message: "Number exists" });
            // res.status(500).json({ message: "Phone exists" });
        } else {
            const user = new User(req.body);
            await user.save();
            return res
                .status(201)
                .json({ payload: user, message: "User created" });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: "Error saving user" });
    }
});

module.exports = router;
