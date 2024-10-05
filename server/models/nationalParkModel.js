const mongoose = require('mongoose');

const nationalParkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true
    },
    established: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('national_parks', nationalParkSchema);