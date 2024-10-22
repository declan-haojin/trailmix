const mongoose = require('mongoose');

const NationalParkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    park_code: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        default: 'No location provided',
    },
    states: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'No image provided',
    },
    description: {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('tests', NationalParkSchema);