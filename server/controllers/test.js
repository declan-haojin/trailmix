const getTest = async (req, res) => {
    res.status(200).json({
        message: 'TrailMix request from backend received successfully!',
    })
};

module.exports = {getTest};