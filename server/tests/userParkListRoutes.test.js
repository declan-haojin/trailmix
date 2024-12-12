const request = require('supertest');
const express = require('express');
const userParkListRoutes = require('../routes/userParkListRoutes');
const userParkListController = require('../controllers/userParkListController');
const authenticateJWT = require('../middlewares/authMiddleware');

jest.mock('../controllers/userParkListController');
jest.mock('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/user-parks', userParkListRoutes);

describe('User Park List Routes', () => {
    beforeEach(() => {
        authenticateJWT.mockImplementation((_, __, next) => next());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /user-parks/add should add a park to the user\'s list', async () => {
        userParkListController.addUserPark.mockImplementation((_, res) => res.status(201).send());

        const response = await request(app)
            .post('/user-parks/add')
            .send({ parkId: '123' });

        expect(response.status).toBe(201);
        expect(userParkListController.addUserPark).toHaveBeenCalled();
    });

    test('GET /user-parks/ should get all parks liked by a specific user', async () => {
        userParkListController.getUserParks.mockImplementation((_, res) => res.status(200).json([]));

        const response = await request(app)
            .get('/user-parks/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
        expect(userParkListController.getUserParks).toHaveBeenCalled();
    });

    test('DELETE /user-parks/remove/:parkId should remove a park from the user\'s list', async () => {
        userParkListController.removeUserPark.mockImplementation((_, res) => res.status(200).send());

        const response = await request(app)
            .delete('/user-parks/remove/123');

        expect(response.status).toBe(200);
        expect(userParkListController.removeUserPark).toHaveBeenCalled();
    });

    test('GET /user-parks/exists/:parkId should check if a park is in the user\'s list', async () => {
        userParkListController.isParkInUserList.mockImplementation((_, res) => res.status(200).json({ exists: true }));

        const response = await request(app)
            .get('/user-parks/exists/123');

        expect(response.status).toBe(200);
        expect(response.body.exists).toBe(true);
        expect(userParkListController.isParkInUserList).toHaveBeenCalled();
    });
});