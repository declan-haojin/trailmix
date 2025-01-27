const NationalPark = require('../models/nationalParkModel');

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

        const pipeline = [{ $match: filters }];

        if (sortBy === 'averageRating') {
            pipeline.push({
                $addFields: {
                    averageRating: {
                        $cond: {
                            if: { $eq: ["$numRatings", 0] },
                            then: 0,
                            else: { $divide: ["$cumulativeRating", "$numRatings"] }
                        }
                    }
                }
            });
            pipeline.push({ $sort: { averageRating: -1 } });
        } else if (sortBy) {
            pipeline.push({ $sort: { [sortBy]: -1 } });
        }

        const parks = await NationalPark.aggregate(pipeline).exec();
        
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

exports.getFunFactsByParkId = async (req, res) => {
    try {
        const { parkId } = req.params;
        const park = await NationalPark.findById(parkId);

        if (!park) {
            return res.status(404).json({ message: 'Park not found.' });
        }
        res.json({ funFact: park.funFact });
    } catch (error) {
        console.error('Error fetching fun fact:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getARandomFunFact = async (req, res) => {
    try {
        const randomPark = await NationalPark.aggregate([{ $sample: { size: 1 } }]);

        if (!randomPark || randomPark.length === 0) {
            return res.status(404).json({ message: 'No parks found' });
        }

        res.json({ 
            park: {
                name: randomPark[0].name,
                park_code: randomPark[0].park_code,
                _id: randomPark[0]._id
            },
            funFact: randomPark[0].funFact 
        });
    } catch (error) {
        console.error('Error fetching random fun fact:', error);
        res.status(500).json({ message: error.message });
    }
};