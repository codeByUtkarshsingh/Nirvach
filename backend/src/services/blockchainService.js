require("dotenv").config();

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

if (!RPC_URL) {
    throw new Error("BLOCKCHAIN_RPC_URL is missing from .env");
}

if (!PRIVATE_KEY) {
    throw new Error("BLOCKCHAIN_PRIVATE_KEY is missing from .env");
}

if (!CONTRACT_ADDRESS) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is missing from .env");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

const wallet = new ethers.Wallet(
    PRIVATE_KEY,
    provider
);

const abi = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../../blockchain/VotingABI.json"),
        "utf8"
    )
);

const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    wallet
);


// RECORD VOTE ON BLOCKCHAIN
const recordVoteOnBlockchain = async (voteHash) => {

    const hashBytes = ethers.id(voteHash);

    const transaction = await contract.recordVote(hashBytes);

    const receipt = await transaction.wait();

    return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        voteHash: hashBytes,
        contractAddress: CONTRACT_ADDRESS
    };
};


// VERIFY VOTE ON BLOCKCHAIN
const verifyVoteOnBlockchain = async (voteHash) => {

    const hashBytes = voteHash;    

    const result = await contract.verifyVote(hashBytes);

    return {
        exists: result[0],
        timestamp: result[1].toString()
    };
};


module.exports = {
    recordVoteOnBlockchain,
    verifyVoteOnBlockchain
};
