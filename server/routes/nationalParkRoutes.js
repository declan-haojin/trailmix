const express = require('express');
const router = express.Router();
const nationalParkController = require('../controllers/nationalParkController');

// Route to get all national parks
router.get('/', nationalParkController.getAllParks);

router.get('/random', nationalParkController.getARandomPark);

router.get('/:parkCode', nationalParkController.getParkByCode);

module.exports = router;