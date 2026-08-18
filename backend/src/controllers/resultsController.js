const Vote = require("../models/Vote");
const User = require("../models/User");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Check election
        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        // Count all registered voters
        const totalVoters = await User.countDocuments({
            role: "voter"
        });

        // Get all candidates for this election
        const candidates = await Candidate.find({
            election: electionId
        }).sort({
            name: 1
        });

        // Count votes for each candidate
        const candidateResults = await Promise.all(
            candidates.map(async (candidate) => {
                const voteCount = await Vote.countDocuments({
                    election: electionId,
                    candidate: candidate._id
                });

                return {
                    candidateId: candidate._id,
                    name: candidate.name,
                    party: candidate.party,
                    symbol: candidate.symbol,
                    votes: voteCount
                };
            })
        );

        // Total votes cast in this election
        const totalVotes = await Vote.countDocuments({
            election: electionId
        });

        // Calculate turnout percentage
        const turnout =
            totalVoters === 0
                ? 0
                : Number(
                    ((totalVotes / totalVoters) * 100).toFixed(2)
                );

        res.status(200).json({
            success: true,

            election: {
                id: election._id,
                title: election.title,
                description: election.description,
                isActive: election.isActive
            },

            statistics: {
                totalVoters,
                totalVotes,
                turnout
            },

            candidates: candidateResults
        });

    } catch (error) {
        console.error("Results error:", error);

        res.status(500).json({
            success: false,
            message: "Could not load election results"
        });
    }
};

module.exports = {
    getElectionResults
};
