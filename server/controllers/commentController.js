const Comment = require('../models/commentModel');
const NationalPark = require('../models/nationalParkModel');

const createComment = async (req, res) => {
    const {parkId, rating, comment, images} = req.body;
    const userId = req.user._id;

    try {
        // Check if park exists
        const park = await NationalPark.findById(parkId);
        if (!park) {
            return res.status(404).json({message: 'National Park not found'});
        }

        // Create and save the comment
        const newComment = new Comment({
            park: parkId,
            user: userId,
            rating,
            comment,
            images
        });

        await newComment.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({message: 'Failed to create comment', error: error.message});
    }
};

// Get all comments for a specific park
const getCommentsByPark = async (req, res) => {
    const {parkId} = req.params;

    try {
        const comments = await Comment.find({park: parkId})
            .populate('user', 'name email') // Assuming you want to populate user details
            .populate('park', 'name'); // Optionally populate park details

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({message: 'Failed to get comments', error: error.message});
    }
};

// Update a comment
const updateComment = async (req, res) => {
    const {commentId} = req.params;
    const {rating, comment, images} = req.body;
    const userId = req.user.id; // Assuming the user is authenticated

    try {
        const existingComment = await Comment.findById(commentId);

        if (!existingComment) {
            return res.status(404).json({message: 'Comment not found'});
        }

        // Check if the user is the author of the comment
        if (existingComment.user.toString() !== userId) {
            return res.status(403).json({message: 'Unauthorized to update this comment'});
        }

        existingComment.rating = rating || existingComment.rating;
        existingComment.comment = comment || existingComment.comment;
        existingComment.images = images || existingComment.images;

        const updatedComment = await existingComment.save();
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({message: 'Failed to update comment', error: error.message});
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    const {commentId} = req.params;
    const userId = req.user.id; // Assuming the user is authenticated

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({message: 'Comment not found'});
        }

        // Check if the user is the author of the comment
        if (comment.user.toString() !== userId) {
            return res.status(403).json({message: 'Unauthorized to delete this comment'});
        }

        await comment.remove();
        res.status(200).json({message: 'Comment deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Failed to delete comment', error: error.message});
    }
};

module.exports = {
    createComment,
    getCommentsByPark,
    updateComment,
    deleteComment
};