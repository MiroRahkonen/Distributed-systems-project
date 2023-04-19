const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let upvoteSchema = new Schema({
    postID: String,
    commentID: String,
    type: String,
    count: {
        type: Number,
        default: 0
    },
    upvoters: [String]
});

module.exports = mongoose.model('upvotes',upvoteSchema);