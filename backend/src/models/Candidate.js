const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        party: {
            type: String,
            trim: true
        },

        symbol: {
            type: String,
            trim: true
        },

        election: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Election",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
