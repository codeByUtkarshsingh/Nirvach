const express = require("express");

const {
    getElectionResults
} = require("../controllers/resultsController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/:electionId",
    authMiddleware,
    adminMiddleware,
    getElectionResults
);

module.exports = router;
