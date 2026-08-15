const User = require("../models/User");

// GET ALL VOTERS - ADMIN ONLY
const getVoters = async (req, res) => {
    try {
        const voters = await User.find(
            { role: "voter" },
            {
                passwordHash: 0
            }
        ).sort({ createdAt: -1 });

        res.json({
            success: true,
            voters
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// SET VOTER ELIGIBILITY
const setVoterEligibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { isEligible } = req.body;

        const voter = await User.findOne({
            _id: id,
            role: "voter"
        });

        if (!voter) {
            return res.status(404).json({
                success: false,
                message: "Voter not found"
            });
        }

        voter.isEligible = Boolean(isEligible);

        await voter.save();

        res.json({
            success: true,
            message: "Voter eligibility updated",
            voter: {
                id: voter._id,
                fullName: voter.fullName,
                email: voter.email,
                isEligible: voter.isEligible
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
    getVoters,
    setVoterEligibility
};
