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

exports.getAllParks = async (req, res) => {
    try {
        const parks = await NationalPark.find();
        res.json(parks);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};