const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');  // Import the controller
const router = express.Router();

// Route to start Google OAuth
router.get('/api/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Route for Google OAuth callback
router.get(
    '/api/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login', session: false}),
    authController.googleCallback
);

module.exports = router;