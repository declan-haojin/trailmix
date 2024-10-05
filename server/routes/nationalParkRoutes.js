const express = require('express');
const router = express.Router();
const nationalParkController = require('../controllers/nationalParkController');

// Route to create a new national park
router.post('/', nationalParkController.createPark);

// Route to get all national parks
router.get('/', nationalParkController.getAllParks);

router.get('/random', nationalParkController.getARandomPark);

// Route to get a specific national park by ID
router.get('/:id', nationalParkController.getParkById);

// Route to update a national park by ID
router.put('/:id', nationalParkController.updatePark);

// Route to delete a national park by ID
router.delete('/:id', nationalParkController.deletePark);

module.exports = router;