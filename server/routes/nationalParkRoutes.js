const express = require('express');
const router = express.Router();
const nationalParkController = require('../controllers/nationalParkController');

// Route to get all national parks
router.get('/funfacts/random', nationalParkController.getARandomFunFact);

router.get('/funfacts/:parkId', nationalParkController.getFunFactsByParkId);

router.get('/random', nationalParkController.getARandomPark);

router.get('/:parkCode', nationalParkController.getParkByCode);

router.get('/', nationalParkController.getAllParks);

module.exports = router;