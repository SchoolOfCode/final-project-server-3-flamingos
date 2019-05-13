const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_KEY = process.env.CLOUD_KEY;
const CLOUD_SECRET = process.env.CLOUD_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  MONGO_URL,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
  JWT_SECRET
};
