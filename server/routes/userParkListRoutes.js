const express = require('express');
const router = express.Router();
const userParkListController = require('../controllers/userParkListController');
const authenticateJWT = require("../middlewares/authMiddleware");

// Route to add a park to the user's list
router.post('/add', authenticateJWT, userParkListController.addUserPark);

// Route to get all parks liked by a specific user
router.get('/:user', authenticateJWT, userParkListController.getUserParks);

// Route to remove a park from the user's list
router.delete('/remove', authenticateJWT, userParkListController.removeUserPark);

// Route to check if a park is in the user's list
router.post('/exists', authenticateJWT, userParkListController.isParkInUserList);

module.exports = router;