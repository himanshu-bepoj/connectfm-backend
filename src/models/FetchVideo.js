const mongoose = require("mongoose");

const fetchVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    lastFetchedTime: {
        type: Date,
        required: true
    },
});

const FetchVideo = mongoose.model("FetchVideo", fetchVideoSchema);
module.exports = FetchVideo;