const Election = require("../models/Election");


// CREATE ELECTION
const createElection = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Title, start date and end date are required"
            });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date"
            });
        }

        const election = await Election.create({
            title,
            description,
            startDate,
            endDate
        });

        res.status(201).json({
            success: true,
            message: "Election created successfully",
            election
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ACTIVATE ELECTION
const activateElection = async (req, res) => {
    try {
        const { id } = req.params;

        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        election.isActive = true;

        await election.save();

        res.status(200).json({
            success: true,
            message: "Election activated successfully",
            election
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getActiveElections = async (req, res) => {
    try {
        const elections = await Election.find({
            isActive: true
        }).sort({
            startDate: 1
        });

        res.status(200).json({
            success: true,
            elections
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
    createElection,
    activateElection,
    getActiveElections
};
