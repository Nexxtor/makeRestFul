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
    tags: { type: [String], index: true } ,
    state: {
        type: String,
        enum: ['draft', 'published', 'private']
    },
    content : {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


PostSchema.index({
  title: 'text',
  content: 'text',
}, {
  weights: {
    title: 2,
    content: 1,
    tags: 3
  },
});

module.exports = mongoose.model("Post", PostSchema);