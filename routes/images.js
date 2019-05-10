const express = require("express");
const router = express.Router();

const { upload } = require("../utils");

router.post("/", upload.single("image"), (req, res) => {
    // console.log(req.file); // to see what is returned to you
    const image = {};
    image.url = req.file.secure_url;
    image.id = req.file.public_id;
    res.json({ id: image.id, url: image.url });
});

module.exports = router;
