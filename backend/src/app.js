const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
    origin:[
         "http://localhost:5173",
         "http://localhost:5174"
      ]

}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Nirvach");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Nirvach backend is running"
    });
});
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Election routes
app.use("/api/elections", electionRoutes);

// Candidate routes
app.use("/api/candidates", candidateRoutes);

// Vote routes
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
