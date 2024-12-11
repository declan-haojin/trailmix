const request = require('supertest');
const express = require('express');
const nationalParkRoutes = require('./nationalParkRoutes');
const nationalParkController = require('../controllers/nationalParkController');

const app = express();
app.use('/parks', nationalParkRoutes);

jest.mock('../controllers/nationalParkController');

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks after each test
});

describe('National Park Routes', () => {
  it('should get a random fun fact', async () => {
    nationalParkController.getARandomFunFact.mockImplementation((req, res) => {
      res.status(200).send({ fact: 'Random fun fact' });
    });

    const response = await request(app).get('/parks/funfacts/random');
    expect(response.status).toBe(200);
    expect(response.body.fact).toBe('Random fun fact');
    expect(nationalParkController.getARandomFunFact).toHaveBeenCalledTimes(1);
  });

  it('should get fun facts by park ID', async () => {
    nationalParkController.getFunFactsByParkId.mockImplementation((req, res) => {
      res.status(200).send({ facts: ['Fact 1', 'Fact 2'] });
    });

    const response = await request(app).get('/parks/funfacts/1');
    expect(response.status).toBe(200);
    expect(response.body.facts).toEqual(['Fact 1', 'Fact 2']);
    expect(nationalParkController.getFunFactsByParkId).toHaveBeenCalledTimes(1);
  });

  it('should get a random park', async () => {
    nationalParkController.getARandomPark.mockImplementation((req, res) => {
      res.status(200).send({ park: 'Random Park' });
    });

    const response = await request(app).get('/parks/random');
    expect(response.status).toBe(200);
    expect(response.body.park).toBe('Random Park');
    expect(nationalParkController.getARandomPark).toHaveBeenCalledTimes(1);
  });

  it('should get park by code', async () => {
    nationalParkController.getParkByCode.mockImplementation((req, res) => {
      res.status(200).send({ park: 'Park by code' });
    });

    const response = await request(app).get('/parks/parkCode');
    expect(response.status).toBe(200);
    expect(response.body.park).toBe('Park by code');
    expect(nationalParkController.getParkByCode).toHaveBeenCalledTimes(1);
  });

  it('should get all parks', async () => {
    nationalParkController.getAllParks.mockImplementation((req, res) => {
      res.status(200).send({ parks: ['Park 1', 'Park 2'] });
    });

    const response = await request(app).get('/parks');
    expect(response.status).toBe(200);
    expect(response.body.parks).toEqual(['Park 1', 'Park 2']);
    expect(nationalParkController.getAllParks).toHaveBeenCalledTimes(1);
  });
});
