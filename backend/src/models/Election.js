const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

       isActive: {
    type: Boolean,
    default: false
},

isCompleted: {
    type: Boolean,
    default: false
},

winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    default: null
},

winnerVoteCount: {
    type: Number,
    default: 0
}

    },
    {
        timestamps: true
    }
);

const Election = mongoose.model("Election", electionSchema);

module.exports = Election;
