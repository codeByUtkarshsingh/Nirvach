const express = require("express");

const {
    createCandidate,
    getCandidatesByElection
} = require("../controllers/candidateController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get candidates for an election - authenticated users
router.get(
    "/:electionId",
    authMiddleware,
    getCandidatesByElection
);

// Create candidate - admin only
router.post(
    "/create",
    authMiddleware,
    adminMiddleware,
    createCandidate
);

module.exports = router;
