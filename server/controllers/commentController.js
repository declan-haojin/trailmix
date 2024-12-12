const Comment = require('../models/commentModel');
const NationalPark = require('../models/nationalParkModel');
const {uploadToR2} = require("../middlewares/uploadMiddleware");

const createComment = async (req, res) => {
    const { rating, comment } = req.body; // Extract from body
    const { parkId } = req.params; // Extract from URL parameters
    const userId = req.user.id;

    try {
        // Check if the park exists
        const park = await NationalPark.findById(parkId);
        if (!park) {
            return res.status(404).json({message: 'National Park not found'});
        }

        // Array to store uploaded image URLs
        const imageUrls = [];

        // Check if images are uploaded
        if (req.files && req.files.length > 0) {
            // Loop through each file and upload to Cloudflare R2
            for (const file of req.files) {
                const result = await uploadToR2(file);
                imageUrls.push(result.Location);
            }
        }

        // Create and save the comment
        const newComment = new Comment({
            park: parkId,
            user: userId,
            rating,
            comment,
            images: imageUrls
        });
        await newComment.save();

        // Calculate new average rating of the park
        park.numRatings += 1;  // Increment the number of ratings
        park.cumulativeRating += Number(rating);  // Add the new rating to the cumulativeRating
        console.log(`Rating += ${rating}`);

        // Save the updated park data
        await park.save();

        // Respond with the new comment and the park's updated data
        res.status(201).json({
            comment: newComment,
            numRatings: park.numRatings,
            averageRating: park.cumulativeRating / park.numRatings  // Calculate the average dynamically
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Failed to create comment', error: error.message});
    }
};

// Get all comments for a specific park
const getCommentsByPark = async (req, res) => {
    const {parkId} = req.params;

    try {
        const comments = await Comment.find({park: parkId})
            .populate('user', 'name email profilePic')
            .sort({createdAt: -1});


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