var mongoose = require("mongoose");
const Schema = mongoose.Schema;


var notificationSchema = new Schema({
	username: String,
    postId: String,
	isRead: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Notification', notificationSchema);