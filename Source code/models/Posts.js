const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
    username: String,
    title: String,
    message: String
});

module.exports = mongoose.model('posts',postSchema);