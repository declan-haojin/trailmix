const NationalPark = require('../models/nationalParkModel');
const axios = require('axios');

const getWebcamsForPark = async (parkCode) => {
    try {
        const webcamResponse = await axios.get(`https://developer.nps.gov/api/v1/webcams`, {
            params: {
                api_key: process.env.NPS_API_KEY,
                parkCode: parkCode
            }
        });
        const webcams = webcamResponse.data.data;

        return webcams.length > 0 ? webcams : [];
    } catch (error) {
        console.error('Error fetching webcam data:', error);
        return [];
    }
};

exports.getParkByCode = async (req, res) => {
    try {
        const {parkCode} = req.params;

        const park = await NationalPark.findOne({park_code: parkCode});

        if (!park) {
            return res.status(404).json({message: 'Park not found.'});
        }

        res.json(park);
    } catch (err) {
        res.status(500).json({message: err.message});
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

// Controller to get all national parks with optional query parameters
exports.getAllParks = async (req, res) => {
    try {
        const filters = {};
        const { state, sortBy } = req.query;

        if (state) {
            filters.states = new RegExp(`\\b${state}\\b`, 'i');
        }

        let query = NationalPark.find(filters);

        if (sortBy) {
            const sortCriteria = {};
            sortCriteria[sortBy] = -1; // 1 for ascending, -1 for descending
            query = query.sort(sortCriteria);
        }

        const parks = await query.exec();
        res.json(parks);
    } catch (err) {
        res.status(500).json({ message: err.message });
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