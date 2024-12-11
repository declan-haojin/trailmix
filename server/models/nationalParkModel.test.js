const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const NationalPark = require('../models/nationalParkModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await NationalPark.deleteMany({});
});

describe('NationalPark Model', () => {
  it('should save a national park with all required fields', async () => {
    const parkData = {
      name: 'Yellowstone',
      park_code: 'YNP',
      states: 'Wyoming',
      description: 'A beautiful park',
    };

    const park = new NationalPark(parkData);
    const savedPark = await park.save();

    expect(savedPark._id).toBeDefined();
    expect(savedPark.name).toBe(parkData.name);
    expect(savedPark.park_code).toBe(parkData.park_code);
    expect(savedPark.states).toBe(parkData.states);
    expect(savedPark.description).toBe(parkData.description);
    expect(savedPark.location).toBe('No location provided'); // Default value
    expect(savedPark.image).toBe('No image provided'); // Default value
    expect(savedPark.funFact).toBe('No fun fact available'); // Default value
    expect(savedPark.numRatings).toBe(0); // Default value
    expect(savedPark.cumulativeRating).toBe(0); // Default value
  });

  it('should not save a national park without required fields', async () => {
    const parkData = { park_code: 'YNP', states: 'Wyoming' }; // Missing required fields

    let err;
    try {
      const park = new NationalPark(parkData);
      await park.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined(); // Missing name
    expect(err.errors.description).toBeDefined(); // Missing description
  });

  it('should enforce unique constraint on park_code', async () => {
    const park1 = new NationalPark({
      name: 'Yellowstone',
      park_code: 'YNP',
      states: 'Wyoming',
      description: 'A beautiful park',
    });
    await park1.save();

    const park2 = new NationalPark({
      name: 'Grand Canyon',
      park_code: 'YNP', // Duplicate park_code
      states: 'Arizona',
      description: 'A majestic canyon',
    });

    let err;
    try {
      await park2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });

  it('should apply default values when fields are missing', async () => {
    const parkData = {
      name: 'Yellowstone',
      park_code: 'YNP',
      states: 'Wyoming',
      description: 'A beautiful park',
    };

    const park = new NationalPark(parkData);
    const savedPark = await park.save();

    expect(savedPark.location).toBe('No location provided');
    expect(savedPark.image).toBe('No image provided');
    expect(savedPark.funFact).toBe('No fun fact available');
  });
});
