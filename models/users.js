const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

userSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.hash(user.password, 10).then(hashedPassword => {
        user.password = hashedPassword;
        next();
    });
});

module.exports = mongoose.model("User", userSchema);
