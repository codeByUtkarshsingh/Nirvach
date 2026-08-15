const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["voter", "admin"],
            default: "voter"
        },

        isEligible: {
            type: Boolean,
            default: false
        },

        hasVoted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;