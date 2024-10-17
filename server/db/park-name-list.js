const axios = require('axios');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
require('dotenv').config({path: '../../.env'}); // Load .env file from ../../

// Function to get all national parks and their info
async function getAllNationalParks() {
    try {
        const apiKey = process.env.NPS_API_KEY; // Read API key from environment variables
        if (!apiKey) {
            throw new Error('API key not found. Please ensure it is set in the .env file.');
        }

        const url = `https://developer.nps.gov/api/v1/parks`;
        const response = await axios.get(url, {
            params: {
                api_key: apiKey,
                limit: 500, // Adjust as needed
            },
        });

        const parks = response.data.data;

        // Filter for national parks and map relevant data
        const nationalParks = parks
            .filter((park) => park.designation === 'National Park')
            .map((park) => ({
                name: park.fullName,
                parkCode: park.parkCode,
                location: park.latLong || 'No location provided',
                states: park.states,
                imageUrl: (park.images && park.images.length > 0) ? park.images[0].url : 'No image provided',
                description: park.description,
            }));

        // Write to CSV file
        writeToCsv(nationalParks);
    } catch (error) {
        console.error('Error fetching parks data:', error);
    }
}

// Function to write national parks data to a CSV file
function writeToCsv(data) {
    const writer = csvWriter({headers: ['name', 'park_code', 'location', 'states', 'image', 'description']});
    const file = 'national_parks.csv';

    writer.pipe(fs.createWriteStream(file));

    data.forEach((park) => {
        writer.write([park.name, park.parkCode, park.location, park.states, park.imageUrl, park.description]);
    });

    writer.end();
    console.log(`Data successfully written to ${file}`);
}

// Call the function to fetch and write the parks data
getAllNationalParks();