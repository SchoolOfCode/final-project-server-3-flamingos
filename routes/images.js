const express = require("express");
const router = express.Router();

const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"]
});

const parser = multer({ storage: storage });

router.post("/", parser.single("image"), (req, res) => {
    // console.log(req.file); // to see what is returned to you
    const image = {};
    image.url = req.file.secure_url;
    image.id = req.file.public_id;
    res.json({ id: image.id, url: image.url });
});

module.exports = router;
