const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");

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
         const elections = await Election.find({})
    .sort({
        startDate: 1
    });

        const electionsWithWinner = await Promise.all(
            elections.map(async (election) => {
                if (election.isCompleted && election.winner) {
                    const winner = await Candidate.findById(
                        election.winner
                    ).select("name party symbol");

                    return {
                        ...election.toObject(),
                        winner
                    };
                }

                return election.toObject();
            })
        );

        res.status(200).json({
            success: true,
            elections: electionsWithWinner
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const finishElection = async (req, res) => {
    try {
        const { id } = req.params;

        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        if (!election.isActive) {
            return res.status(400).json({
                success: false,
                message: "Election is not active"
            });
        }

        // Get all candidates for this election
        const candidates = await Candidate.find({
            election: id
        });

        if (candidates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No candidates found for this election"
            });
        }

        // Count votes for every candidate
        let winner = null;
        let highestVotes = -1;

        for (const candidate of candidates) {
            const voteCount = await Vote.countDocuments({
                election: id,
                candidate: candidate._id
            });

            if (voteCount > highestVotes) {
                highestVotes = voteCount;
                winner = candidate;
            }
        }

        // Complete the election
        election.isActive = false;
        election.isCompleted = true;
        election.winner = winner._id;
        election.winnerVoteCount = highestVotes;

        await election.save();

        res.status(200).json({
            success: true,
            message: "Election completed successfully",
            election: {
                id: election._id,
                title: election.title,
                isActive: election.isActive,
                isCompleted: election.isCompleted,
                winner: {
                    id: winner._id,
                    name: winner.name,
                    party: winner.party,
                    symbol: winner.symbol
                },
                winnerVoteCount: highestVotes
            }
        });

    } catch (error) {
        console.error("Finish election error:", error);

        res.status(500).json({
            success: false,
            message: "Could not finish election"
        });
    }
};



module.exports = {
    createElection,
    activateElection,
    getActiveElections,
    finishElection
};
