const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    image: String
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email"});

module.exports = mongoose.model('User', UserSchema);