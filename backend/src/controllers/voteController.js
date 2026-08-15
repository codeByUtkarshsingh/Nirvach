const crypto = require("crypto");
const mongoose = require("mongoose");

const Vote = require("../models/Vote");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

const {
    recordVoteOnBlockchain,
    verifyVoteOnBlockchain
} = require("../services/blockchainService");


// CAST VOTE
const castVote = async (req, res) => {
    try {
        const { electionId, candidateId } = req.body;

        // Validate request
        if (!electionId || !candidateId) {
            return res.status(400).json({
                success: false,
                message: "Election ID and candidate ID are required"
            });
        }
// Check voter eligibility
const voter = await require("../models/User").findById(
    req.user.userId
);

if (!voter) {
    return res.status(404).json({
        success: false,
        message: "Voter not found"
    });
}

if (voter.role !== "voter") {
    return res.status(403).json({
        success: false,
        message: "Only voters can cast votes"
    });
}

if (!voter.isEligible) {
    return res.status(403).json({
        success: false,
        message: "You are not eligible to vote"
    });
}

        // Check election
        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        // Check election status
        if (!election.isActive) {
            return res.status(400).json({
                success: false,
                message: "Election is not active"
            });
        }

        // Check candidate belongs to election
        const candidate = await Candidate.findOne({
            _id: candidateId,
            election: electionId
        });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found for this election"
            });
        }

        // Prevent duplicate voting
        const existingVote = await Vote.findOne({
            voter: req.user.userId,
            election: electionId
        });

        if (existingVote) {
            return res.status(409).json({
                success: false,
                message: "You have already voted in this election"
            });
        }

        // Generate vote ID before blockchain recording
        const voteId = new mongoose.Types.ObjectId();

        // Create anonymous vote hash
        const voteData = [
            voteId.toString(),
            electionId,
            candidateId
        ].join(":");

        const voteHash = crypto
            .createHash("sha256")
            .update(voteData)
            .digest("hex");

        let blockchainResult;

        try {
            // Record vote hash on blockchain first
            blockchainResult =
                await recordVoteOnBlockchain(voteHash);

        } catch (blockchainError) {
            console.error(
                "Blockchain recording failed:",
                blockchainError
            );

            return res.status(500).json({
                success: false,
                message: "Vote could not be recorded on blockchain"
            });
        }

        // Only create MongoDB vote after blockchain succeeds
        const vote = await Vote.create({
            _id: voteId,
            voter: req.user.userId,
            election: electionId,
            candidate: candidateId,
            blockchain: {
                voteHash: blockchainResult.voteHash,
                transactionHash: blockchainResult.transactionHash,
                blockNumber: blockchainResult.blockNumber,
                contractAddress: blockchainResult.contractAddress
            }
        });
       voter.hasVoted = true;

        await voter.save();

        // Return vote confirmation
        res.status(201).json({
            success: true,
            message: "Vote cast successfully",
            voteId: vote._id,
            blockchain: {
                transactionHash:
                    blockchainResult.transactionHash,
                blockNumber:
                    blockchainResult.blockNumber,
                voteHash:
                    blockchainResult.voteHash,
                contractAddress:
                    blockchainResult.contractAddress
            }
        });

    } catch (error) {
        console.error(error);

        // Handle MongoDB duplicate-vote constraint
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already voted in this election"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// VERIFY VOTE
const verifyVote = async (req, res) => {
    try {
        const { voteId } = req.params;

        const vote = await Vote.findById(voteId);

        if (!vote) {
            return res.status(404).json({
                success: false,
                message: "Vote not found"
            });
        }

        if (!vote.blockchain || !vote.blockchain.voteHash) {
            return res.status(404).json({
                success: false,
                message: "Blockchain record not found"
            });
        }

        const blockchainResult =
            await verifyVoteOnBlockchain(
                vote.blockchain.voteHash
            );

        res.status(200).json({
            success: true,
            verified: blockchainResult.exists,
            blockchain: {
                voteHash: vote.blockchain.voteHash,
                transactionHash:
                    vote.blockchain.transactionHash,
                blockNumber:
                    vote.blockchain.blockNumber,
                contractAddress:
                    vote.blockchain.contractAddress,
                blockchainTimestamp:
                    blockchainResult.timestamp
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Blockchain verification failed"
        });
    }
};


module.exports = {
    castVote,
    verifyVote
};
