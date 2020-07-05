const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const notificationSchema = new Schema({
	username: String,
    postId: String,
	isRead: { 
        type: Boolean, 
        default: false 
    },
    time: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Notification', notificationSchema);