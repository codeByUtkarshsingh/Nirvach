const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};


// REGISTER VOTER
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "voter",
            isEligible: true,
            hasVoted: false
        });

        res.status(201).json({
            success: true,
            message: "Voter registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isEligible: user.isEligible
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// REGISTER ADMIN
const registerAdmin = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            adminKey
        } = req.body;

        if (!fullName || !email || !password || !adminKey) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
            return res.status(403).json({
                success: false,
                message: "Invalid admin registration key"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "admin",
            isEligible: true,
            hasVoted: false
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = createToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isEligible: user.isEligible,
                hasVoted: user.hasVoted
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    registerUser,
    registerAdmin,
    loginUser
};
