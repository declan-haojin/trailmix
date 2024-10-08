const User = require('../models/userModel');  // Import the User model

exports.getUserProfile = async (req, res) => {
    try {
        // Extract the email from the decoded JWT token (from req.user)
        const {email} = req.user;

        // Find the user in the database using the email
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.json({
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve user profile'});
    }
};