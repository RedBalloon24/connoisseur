const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    title: String,
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'   
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Post'  
    },
    postTitle: {
        type: String,
        ref: 'Post'  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Review', ReviewSchema);