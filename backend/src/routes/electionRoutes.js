const express = require("express");

const { createElection,
        activateElection,
        getActiveElections
 } = require("../controllers/electionController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get active elections - authenticated voters/admins

router.get(
    "/",
    authMiddleware,
    getActiveElections
);

router.post(
    "/create",
    authMiddleware,
    adminMiddleware,
    createElection
);

router.post(
    "/activate/:id",
    authMiddleware,
    adminMiddleware,
    activateElection
);

module.exports = router;
