const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.googleCallback = async (req, res) => {
    console.log(`Google callback function evoked!`);
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

        const redirectUrl =
            process.env.VERCEL_ENV === 'production'
                ? `https://trailmix.haojin.li?token=${token}`
                : process.env.VERCEL_ENV === 'preview'
                    ? `https://trailmix-client-declan-haojin-haojin.vercel.app?token=${token}`
                    : `http://localhost:3000?token=${token}`;

        console.log(`REDIRECT_URL: ${redirectUrl}`);
        res.redirect(redirectUrl);
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