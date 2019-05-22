const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const twilio = require("twilio");
// Import config for api keys and JWT secret
const config = require("../config");

var accountSid = config.TWILIO_ACCOUNTSID; // Your Account SID from www.twilio.com/console
var authToken = config.AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
var twilioNumber = config.TWILIO_NUMBER;
var client = new twilio(accountSid, authToken);

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
const confirmPost = (number, postId) => {
  client.messages
    .create({
      body: `Looks like you just made a post. Just checking it's you. Click here to confirm: http://${
        config.IP_CONFIG
      }:${config.CLIENT_PORT}/c/${postId}`,
      to: `${number}`, // Text this number
      from: `${twilioNumber}` // From a valid Twilio number
    })
    .then(message => console.log(message.sid));
};

module.exports = {
  upload,
  comparePassword,
  authenticate,
  confirmPost
};
