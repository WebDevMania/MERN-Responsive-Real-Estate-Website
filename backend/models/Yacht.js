const mongoose = require("mongoose")

const YachtSchema = new mongoose.Schema({
    currentOwner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        min: 6,
    },
    desc: {
        type: String,
        required: true,
        min: 12,
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxPassengers: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    metersLong: {
        type: String,
        required: true
    },
    bookmarkedUsers: {
        type: [String],
        default: []
    }
}, {timestamps: true})

module.exports = mongoose.model("Yacht", YachtSchema)