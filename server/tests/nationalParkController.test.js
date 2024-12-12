const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const NationalPark = require('../models/nationalParkModel');
const nationalParkController = require('../controllers/nationalParkController');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(express.json());
app.get('/parks/random', nationalParkController.getARandomPark);
app.get('/parks', nationalParkController.getAllParks);
app.get('/parks/:parkCode', nationalParkController.getParkByCode);
app.get('/parks/id/:id', nationalParkController.getParkById);
app.put('/parks/:id', nationalParkController.updatePark);
app.delete('/parks/:id', nationalParkController.deletePark);
app.get('/parks/:parkId/funfacts', nationalParkController.getFunFactsByParkId);
app.get('/parks/random/funfact', nationalParkController.getARandomFunFact);

let mongoServer;

describe('National Park Controller', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await NationalPark.deleteMany({});
  });

  it('should sort parks by numRatings', async () => {
    const park1 = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park', numRatings: 5}); 
    const park2 = new NationalPark({ park_code: 'GNP', name: 'Glacier', states: 'MT', description: 'Second national park', numRatings: 10 });
    await park1.save();
    await park2.save();

    const res = await request(app).get('/parks?sortBy=numRatings');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Glacier');
    expect(res.body[1].name).toBe('Yellowstone');
  });

  it('should sort parks by averageRating', async () => {
    const park1 = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park', cumulativeRating: 20, numRatings: 5 });
    const park2 = new NationalPark({ park_code: 'GNP', name: 'Glacier', states : 'MT', description: 'Second national park', cumulativeRating: 10, numRatings: 2 });
    await park1.save();
    await park2.save();

    const res = await request(app).get('/parks?sortBy=averageRating');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Glacier');
    expect(res.body[1].name).toBe('Yellowstone');
  });

  it('should get a park by park code', async () => {
    const park = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park' });
    await park.save();

    const res = await request(app).get('/parks/YNP');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Yellowstone');
  });

  it('should get a park by ID', async () => {
    const park = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park' });
    await park.save();

    const res = await request(app).get(`/parks/id/${park._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Yellowstone');
  });

  it('should update a park by ID', async () => {
    const park = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park' });
    await park.save();

    const res = await request(app)
      .put(`/parks/${park._id}`)
      .send({ name: 'Updated Yellowstone' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Yellowstone');
  });

  it('should delete a park by ID', async () => {
    const park = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park' });
    await park.save();

    const res = await request(app).delete(`/parks/${park._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Park deleted');
  });

  it('should get fun facts by park ID', async () => {
    const park = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states: 'WY', description: 'First national park', funFact: 'First national park' });
    await park.save();

    const res = await request(app).get(`/parks/${park._id}/funfacts`);
    expect(res.status).toBe(200);
    expect(res.body.funFact).toBe('First national park');
  });

  it('should get a random fun fact', async () => {
    const park = new NationalPark({ park_code: 'YNP', name: 'Yellowstone', states : 'WY', description: 'First national park', funFact: 'First national park' });
    await park.save();

    const res = await request(app).get('/parks/random/funfact');
    expect(res.status).toBe(200);
    expect(res.body.funFact).toBe('First national park');
    expect(res.body.park.name).toBe('Yellowstone');
  });
});
