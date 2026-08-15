const fs = require("fs");
const solc = require("solc");

const source = fs.readFileSync(
    __dirname + "/Voting.sol",
    "utf8"
);

const input = {
    language: "Solidity",
    sources: {
        "Voting.sol": {
            content: source
        }
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"]
            }
        }
    }
};

const output = JSON.parse(
    solc.compile(JSON.stringify(input))
);

if (output.errors) {
    const errors = output.errors.filter(
        error => error.severity === "error"
    );

    if (errors.length > 0) {
        console.error(errors);
        process.exit(1);
    }
}

const contract = output.contracts["Voting.sol"]["NirvachVoting"];

fs.writeFileSync(
    __dirname + "/VotingABI.json",
    JSON.stringify(contract.abi, null, 2)
);

fs.writeFileSync(
    __dirname + "/VotingBytecode.json",
    JSON.stringify(
        {
            bytecode: contract.evm.bytecode.object
        },
        null,
        2
    )
);

console.log("NirvachVoting contract compiled successfully.");
