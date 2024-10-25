const express = require('express');
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected route for user profile
router.get('/profile', authenticateJWT, userController.getUserProfile);

module.exports = router;