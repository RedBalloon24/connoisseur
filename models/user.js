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
    image: {
        secure_url: {
            type: String,
            default: '/images/default-profile2.jpg'
        },
        public_id: String
    },
    following: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    ],
    followers: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email"});

// UserSchema.methods.follow = function(id){
//     if(this.following.indexOf(id) === -1){
//       this.following.push(id);
//     }
  
//     return this.save();
// };

// UserSchema.methods.unfollow = function(id){
//     this.following.remove(id);
//     return this.save();
// };

// UserSchema.methods.isFollowing = function(id){
//     return this.following.some(function(followId){
//       return followId.toString() === id.toString();
//     });
// };

UserSchema.methods.toProfileJSONFor = function(user){
    return {
      username: this.username,
      bio: this.bio,
      image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
      following: user ? user.isFollowing(this._id) : false
    };
};

module.exports = mongoose.model('User', UserSchema);