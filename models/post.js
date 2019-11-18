const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: { type: String, require: true }
    }],
    tags: [
        String
    ],
    state: {
        type: String,
        enum: ['draft', 'published', 'private']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);