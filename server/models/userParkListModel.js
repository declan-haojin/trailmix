const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const userParkListSchema = new mongoose.Schema({
    park: {
        type: Schema.Types.ObjectId,
        ref: 'NationalPark',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const UserParkList = mongoose.model('UserParkList', userParkListSchema);
module.exports = UserParkList;