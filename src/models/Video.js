const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ["newsroom", "lifestyle", "entertainment"]
    },
    videoId: {
        type: String,
        required: true,
    },
    snippet: {
        channelId: {
            type: String,
            required: true
        },
        channelTitle: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        liveBroadcastContent: {
            type: String,
        },
        publishTime: {
            type: Date,
            required: true
        },
        publishedAt: {
            type: Date,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        thumbnails: {
            default: {
                height: {
                    type: Number,
                },
                width: {
                    type: Number
                },
                url: {
                    type: String
                }
            },
            high: {
                height: {
                    type: Number,
                },
                width: {
                    type: Number
                },
                url: {
                    type: String
                }
            },
            medium: {
                height: {
                    type: Number,
                },
                width: {
                    type: Number
                },
                url: {
                    type: String
                }
            }
        }
    }
})

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;