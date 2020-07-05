const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Notification = require('./notification');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        secure_url: {
            type: String,
            default: '/images/default-profile2.jpg'
        },
        public_id: String
    },
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'

        }
    ],
    followers: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.pre('remove', async function() {
    await Notification.deleteMany({
        _id: {
            $in: this.notifications
        }
    });
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email'});


module.exports = mongoose.model('User', UserSchema);