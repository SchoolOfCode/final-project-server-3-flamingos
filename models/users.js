const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    displayName: { type: String },
    password: String,
    securityQuestion: { question: String, answer: String },
    randomIdentity: {
      data: String,
      timeGenerated: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
