const express = require('express');
const router = express.Router();
const userParkListController = require('../controllers/userParkListController');

// Route to add a park to the user's list
router.post('/add', userParkListController.addUserPark);

// Route to get all parks liked by a specific user
router.get('/:user', userParkListController.getUserParks);

// Route to remove a park from the user's list
router.delete('/remove', userParkListController.removeUserPark);

// Route to check if a park is in the user's list
router.post('/exists', userParkListController.isParkInUserList);

module.exports = router;