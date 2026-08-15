// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NirvachVoting {

    struct Vote {
        bytes32 voteHash;
        uint256 timestamp;
    }

    mapping(bytes32 => Vote) private votes;

    event VoteRecorded(
        bytes32 indexed voteHash,
        uint256 timestamp
    );

    function recordVote(bytes32 _voteHash) public {
        require(votes[_voteHash].timestamp == 0, "Vote already recorded");

        votes[_voteHash] = Vote({
            voteHash: _voteHash,
            timestamp: block.timestamp
        });

        emit VoteRecorded(_voteHash, block.timestamp);
    }

    function verifyVote(bytes32 _voteHash)
        public
        view
        returns (bool exists, uint256 timestamp)
    {
        Vote memory vote = votes[_voteHash];

        if (vote.timestamp == 0) {
            return (false, 0);
        }

        return (true, vote.timestamp);
    }
}
