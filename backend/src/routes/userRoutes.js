const express = require("express");

const {
    getVoters,
    setVoterEligibility
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/voters",
    authMiddleware,
    adminMiddleware,
    getVoters
);

router.patch(
    "/voters/:id/eligibility",
    authMiddleware,
    adminMiddleware,
    setVoterEligibility
);

module.exports = router;
