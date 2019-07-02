const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password'.toLowerCase())){
                throw new Error('Password must not contain the word password!');
            }

            if(value.length <= 8){
                throw new Error('Password must be more than eight characters!');
            }
        }
    },
    favAlbums: [{
        type: Schema.Types.ObjectId,
        ref: 'Album'
    }],
    favArtists: [{
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//find user by username.
//then compare user passwords
//if good return user else throw unable to login errors
userSchema.static.findUserByUsername = async (username, password) => {
    const user = await User.findOne({ username });

    if(!user){
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login!');
    }

    return user;
};

//generates authorization token for a newly created/logged in user
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;