const Candidate = require("../models/Candidate");
const Election = require("../models/Election");

const createCandidate = async (req, res) => {
    try {
        const { name, party, symbol, electionId } = req.body;

        if (!name || !electionId) {
            return res.status(400).json({
                success: false,
                message: "Candidate name and election ID are required"
            });
        }

        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        const candidate = await Candidate.create({
            name,
            party,
            symbol,
            election: electionId
        });

        res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            candidate
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getCandidatesByElection = async (req, res) => {
    try {
        const { electionId } = req.params;

        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        const candidates = await Candidate.find({
            election: electionId
        }).sort({
            name: 1
        });

        res.status(200).json({
            success: true,
            candidates
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
    createCandidate,
    getCandidatesByElection
};
