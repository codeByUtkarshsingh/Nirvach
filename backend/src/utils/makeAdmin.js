require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOneAndUpdate(
            { email: "testvoter@nirvach.com" },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            console.log("User not found");
        } else {
            console.log(`User ${user.email} is now an admin`);
        }

        await mongoose.disconnect();

    } catch (error) {
        console.error("Error:", error.message);
    }
};

makeAdmin();
