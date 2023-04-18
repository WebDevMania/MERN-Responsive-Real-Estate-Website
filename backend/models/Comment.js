const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    listing: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Comment", CommentSchema)