const express = require('express');
const router = express.Router();
const nationalParkController = require('../controllers/nationalParkController');

// Route to create a new national park
router.post('/', nationalParkController.createPark);

// Route to get all national parks
router.get('/', nationalParkController.getAllParks);

router.get('/random', nationalParkController.getARandomPark);

// Route to get all national parks by state
router.get('/:state', nationalParkController.getParksByState);

module.exports = router;