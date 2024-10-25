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
    numRatings: {
        type: Number,
        default: 0
    },
    cumulativeRating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('tests', NationalParkSchema);