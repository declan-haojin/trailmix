const express = require('express');
const router = express.Router();
const {
    createComment,
    getCommentsByPark,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const authenticateJWT = require('../middlewares/authMiddleware');

// Route to create a new comment for a national park
// Protected route: only authenticated users can create comments
router.post('/:parkId', authenticateJWT, createComment);

// Route to get all comments for a specific national park
router.get('/:parkId', getCommentsByPark);

// Route to update a comment (only the user who created the comment can update it)
// Protected route: only authenticated users can update their own comments
router.put('/:commentId', authenticateJWT, updateComment);

// Route to delete a comment (only the user who created the comment can delete it)
// Protected route: only authenticated users can delete their own comments
router.delete('/:commentId', authenticateJWT, deleteComment);

module.exports = router;