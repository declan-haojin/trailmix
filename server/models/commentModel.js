const {Schema, model} = require("mongoose");

const CommentSchema = new Schema({
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
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    }
}, {timestamps: true});

module.exports = model('comments', CommentSchema);