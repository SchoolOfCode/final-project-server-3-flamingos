const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_KEY = process.env.CLOUD_KEY;
const CLOUD_SECRET = process.env.CLOUD_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const TWILIO_ACCOUNTSID = process.env.TWILIO_ACCOUNTSID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const IP_CONFIG = process.env.IP_CONFIG;
const CLIENT_PORT = process.env.CLIENT_PORT;

module.exports = {
  MONGO_URL,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
  JWT_SECRET,
  TWILIO_ACCOUNTSID,
  AUTH_TOKEN,
  TWILIO_NUMBER,
  IP_CONFIG,
  CLIENT_PORT
};
