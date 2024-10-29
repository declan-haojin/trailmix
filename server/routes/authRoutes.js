const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authenticateJWT = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to start Google OAuth
router.get('/api/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Route for Google OAuth callback
router.get(
    '/api/auth/google/callback',
    passport.authenticate('google', {session: false}),
    authController.googleCallback
);

router.post('/api/auth/google/logout', authenticateJWT, authController.logout);

module.exports = router;