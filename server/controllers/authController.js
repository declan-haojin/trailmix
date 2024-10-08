const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Google OAuth callback logic
exports.googleCallback = async (req, res) => {
    try {
        // Extract Google profile information
        const {id, emails, displayName} = req.user;

        // Check if the user already exists in your database
        let user = await User.findOne({googleId: id});

        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                googleId: id,
                email: emails[0].value,
                name: displayName
            });
            await user.save();
        }

        // Issue a JWT token
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        );

        res.cookie('token', token, {
            httpOnly: true,  // Prevent JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production',  // Use HTTPS in production
            maxAge: 30 * 24 * 60 * 60 * 1000  // Cookie expires in 30 days
        });

        // Redirect to the frontend depending on the environment
        if (process.env.VERCEL_ENV === 'production') {
            res.redirect('https://trailmix.haojin.li');
        } else if (process.env.VERCEL_ENV === 'preview') {
            res.redirect('https://trailmix-client-declan-haojin-haojin.vercel.app');
        } else {
            res.redirect('http://localhost:3000');
        }

    } catch (error) {
        res.status(500).json({error: 'Server error during authentication'});
    }
};

// Protected route logic
exports.protectedRoute = (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);  // Forbidden, invalid token
            }

            // Token is valid, return the user data or proceed with the action
            res.json({message: 'You are authenticated!', user});
        });
    } else {
        res.sendStatus(401);  // Unauthorized, no token provided
    }
};