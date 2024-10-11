const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    name: {type: String},
    profilePic: {type: String, required: false, default: ''},
    accessToken: {type: String},
});

module.exports = mongoose.model('user', userSchema);