const express = require("express");

const {
    castVote,
    verifyVote
} = require("../controllers/voteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/cast",
    authMiddleware,
    castVote
);

router.get(
    "/verify/:voteId",
    verifyVote
);

module.exports = router;
