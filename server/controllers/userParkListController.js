const UserParkList = require('../models/userParkListModel');

// Add a park to the user's list
exports.addUserPark = async (req, res) => {
    const { parkId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the entry already exists
        const existingEntry = await UserParkList.findOne({ park: parkId, user: userId });

        if (existingEntry) {
            return res.status(400).json({ message: 'Park already added to your list.' });
        }

        // Create and save the new entry
        const newEntry = new UserParkList({ park: parkId, user: userId });
        await newEntry.save();

        res.status(201).json({ message: 'Park added to user list', data: newEntry });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add park', details: error.message });
    }
};

// Get all parks liked by a user
exports.getUserParks = async (req, res) => {
    const { user_id } = req.params;

    try {
        const userParks = await UserParkList.find({ user_id }).populate('park_id');
        res.status(200).json(userParks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch parks', details: error.message });
    }
};

// Remove a park from the user's list
exports.removeUserPark = async (req, res) => {
    const { user_id, park_id } = req.body;

    try {
        const deletedEntry = await UserParkList.findOneAndDelete({ user_id, park_id });
        if (deletedEntry) {
            res.status(200).json({ message: 'Park removed from user list' });
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove park', details: error.message });
    }
};

// Check if a park is already in the user's list
exports.isParkInUserList = async (req, res) => {
    const { user_id, park_id } = req.body;

    try {
        const exists = await UserParkList.exists({ user_id, park_id });
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check park', details: error.message });
    }
};