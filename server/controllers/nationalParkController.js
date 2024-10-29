const NationalPark = require('../models/nationalParkModel');

// Controller to create a new national park
exports.createPark = async (req, res) => {
    try {
        const park = new NationalPark({
            name: req.body.name,
            location: req.body.location,
            established: req.body.established,
            size: req.body.size,
            description: req.body.description,
            attractions: req.body.attractions
        });
        const savedPark = await park.save();
        res.status(201).json(savedPark);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getARandomPark = async (req, res) => {
    try {
        const parks = await NationalPark.aggregate([{$sample: {size: 1}}]);
        res.json(parks);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Controller to get all national parks
exports.getAllParks = async (req, res) => {
    try {
        const parks = await NationalPark.find();
        res.json(parks);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Controller to get a specific national park by ID
exports.getParkById = async (req, res) => {
    try {
        const park = await NationalPark.findById(req.params.id);
        if (!park) {
            return res.status(404).json({message: 'Park not found'});
        }
        res.json(park);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Controller to update a national park by ID
exports.updatePark = async (req, res) => {
    try {
        const updatedPark = await NationalPark.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                location: req.body.location,
                established: req.body.established,
                size: req.body.size,
                description: req.body.description,
                attractions: req.body.attractions
            },
            {new: true}
        );
        if (!updatedPark) {
            return res.status(404).json({message: 'Park not found'});
        }
        res.json(updatedPark);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

// Controller to delete a national park by ID
exports.deletePark = async (req, res) => {
    try {
        const park = await NationalPark.findByIdAndDelete(req.params.id);
        if (!park) {
            return res.status(404).json({message: 'Park not found'});
        }
        res.json({message: 'Park deleted'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Controller to get all national parks in a specific state
exports.getParksByState = async (req, res) => {
    try {
        const parks = await NationalPark.find({state: req.params.state});
        res.json(parks);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};