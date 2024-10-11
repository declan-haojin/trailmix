const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/userModel');

exports.googleCallback = async (req, res) => {
    try {
        const {id, emails, displayName, photos, accessToken} = req.user;

        let user = await User.findOne({googleId: id});

        if (!user) {
            user = new User({
                googleId: id,
                email: emails[0].value,
                name: displayName,
                profilePic: photos[0].value,
                accessToken: accessToken,
            });
            await user.save();
        } else {
            // Update the accessToken in the existing user's record
            user.accessToken = accessToken;
            await user.save();
        }

        // Issue a JWT token
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        );

        const redirectUrl =
            process.env.VERCEL_ENV === 'production'
                ? `https://trailmix.haojin.li?token=${token}`
                : process.env.VERCEL_ENV === 'preview'
                    ? `https://trailmix-client-declan-haojin-haojin.vercel.app?token=${token}`
                    : `http://localhost:3000?token=${token}`;

        res.redirect(redirectUrl);
    } catch (error) {
        res.status(500).json({error: 'Server error during authentication'});
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (user) {
            if (user.accessToken) {
                // Revoke the access token with Google
                await axios.get(
                    `https://accounts.google.com/o/oauth2/revoke?token=${user.accessToken}`
                );

                // Remove the access token from the user's record
                user.accessToken = null;
                await user.save();
            }
            res.status(200).json({message: 'Successfully logged out'});
        } else {
            res.status(400).json({error: 'User not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to log out'});
    }
};