const express = require("express");

const {
    createCandidate,
    getCandidatesByElection,
    withdrawCandidate
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

router.patch(
    "/:id/withdraw",
    authMiddleware,
    adminMiddleware,
    withdrawCandidate
);

module.exports = router;
