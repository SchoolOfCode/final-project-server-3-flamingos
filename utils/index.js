const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import config for api keys and JWT secret
const config = require("../config");

// Cloudinary Save Image
cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUD_KEY,
    api_secret: config.CLOUD_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "watu",
    allowedFormats: ["jpg", "png"]
});
const upload = multer({ storage: storage });

// Authentication
const comparePassword = (candidatePassword, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};
const authenticate = (req, res, next) => {
    const token = req.query.token;
    // decode token
    if (token) {
        // verifies secret and checks exp
        return jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Failed to authenticate token."
                });
            }
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            //console.table(decoded);
            next();
        });
    } else {
        res.status(403).json({ message: "Access Denied" });
    }
};

module.exports = {
    upload,
    comparePassword,
    authenticate
};
