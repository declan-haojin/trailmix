const express = require('express');
const router = express.Router();
const nationalParkController = require('../controllers/nationalParkController');

// Route to get all national parks
router.get('/', nationalParkController.getAllParks);

router.get('/random', nationalParkController.getARandomPark);

// Route to get all national parks by state
router.get('/:state', nationalParkController.getParksByState);

router.get('/:parkCode', nationalParkController.getParkByCode);

module.exports = router;