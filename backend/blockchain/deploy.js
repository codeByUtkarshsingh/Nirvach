require("dotenv").config();

const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
        throw new Error(
            "Blockchain RPC URL or private key is missing from .env"
        );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const abi = JSON.parse(
        fs.readFileSync(
            __dirname + "/VotingABI.json",
            "utf8"
        )
    );

    const bytecodeData = JSON.parse(
        fs.readFileSync(
            __dirname + "/VotingBytecode.json",
            "utf8"
        )
    );

    const factory = new ethers.ContractFactory(
        abi,
        bytecodeData.bytecode,
        wallet
    );

    console.log("Deploying NirvachVoting...");
    console.log("Deployer:", wallet.address);

    const contract = await factory.deploy();

    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("NirvachVoting deployed successfully!");
    console.log("Contract address:", address);

    fs.writeFileSync(
        __dirname + "/deployment.json",
        JSON.stringify(
            {
                address,
                network: "Ganache",
                rpc: rpcUrl
            },
            null,
            2
        )
    );

    console.log("Deployment information saved.");
}

main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
});
