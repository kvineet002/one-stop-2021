const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    deviceTokens: {
        type: [String],
        default: [],
    },
    password: { type: String, required: true },
    roles: { type: [String], default: [] },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const match = await bcrypt.compare(candidatePassword, this.password);
        return match;
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model("onestopUser", userSchema);
