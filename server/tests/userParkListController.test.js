const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userParkListController = require('../controllers/userParkListController');
const UserParkList = require('../models/userParkListModel');
const NationalPark = require('../models/nationalParkModel');

const app = express();
app.use(express.json());

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    if (user && user.id) {
        req.user = user;
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
};

app.post('/user/parks', authenticateUser, userParkListController.addUserPark);
app.get('/user/parks', authenticateUser, userParkListController.getUserParks);
app.delete('/user/parks/:parkId', authenticateUser, userParkListController.removeUserPark);
app.get('/user/parks/:parkId', authenticateUser, userParkListController.isParkInUserList);

jest.mock('../models/userParkListModel');
jest.mock('../models/nationalParkModel');

describe('UserParkList Controller', () => {
    let userId;
    let parkId;

    beforeEach(() => {
        userId = new mongoose.Types.ObjectId();
        parkId = new mongoose.Types.ObjectId();
    });

    describe('addUserPark', () => {
        it('should add a park to the user list', async () => {
            UserParkList.findOne.mockResolvedValue(null);
            UserParkList.prototype.save.mockResolvedValue({ park: parkId, user: userId });

            const res = await request(app)
                .post('/user/parks')
                .send({ parkId })
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Park added to user list');
        });

        it('should return 400 if park already exists in user list', async () => {
            UserParkList.findOne.mockResolvedValue({ park: parkId, user: userId });

            const res = await request(app)
                .post('/user/parks')
                .send({ parkId })
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Park already added to your list.');
        });

        it('should return 500 if there is a server error', async () => {
            UserParkList.findOne.mockRejectedValue(new Error('Server error'));

            const res = await request(app)
                .post('/user/parks')
                .send({ parkId })
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to add park');
        });
    });

    describe('getUserParks', () => {
        it('should get all parks liked by a user', async () => {
            UserParkList.find.mockResolvedValue([{ park: parkId, user: userId }]);
            NationalPark.find.mockResolvedValue([{ _id: parkId, name: 'Yellowstone' }]);

            const res = await request(app)
                .get('/user/parks')
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ _id: parkId.toString(), name: 'Yellowstone' }]);
        });

        it('should return 500 if there is a server error', async () => {
            UserParkList.find.mockRejectedValue(new Error('Server error'));

            const res = await request(app)
                .get('/user/parks')
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to fetch parks');
        });
    });

    describe('removeUserPark', () => {
        it('should remove a park from the user list', async () => {
            UserParkList.findOneAndDelete.mockResolvedValue({ park: parkId, user: userId });

            const res = await request(app)
                .delete(`/user/parks/${parkId}`)
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Park removed from user list');
        });

        it('should return 404 if the entry is not found', async () => {
            UserParkList.findOneAndDelete.mockResolvedValue(null);

            const res = await request(app)
                .delete(`/user/parks/${parkId}`)
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Entry not found');
        });

        it('should return 500 if there is a server error', async () => {
            UserParkList.findOneAndDelete.mockRejectedValue(new Error('Server error'));

            const res = await request(app)
                .delete(`/user/parks/${parkId}`)
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to remove park');
        });
    });

    describe('isParkInUserList', () => {
        it('should check if a park is in the user list', async () => {
            UserParkList.exists.mockResolvedValue(true);

            const res = await request(app)
                .get(`/user/parks/${parkId}`)
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(200);
            expect(res.body.exists).toBe(true);
        });

        it('should return 500 if there is a server error', async () => {
            UserParkList.exists.mockRejectedValue(new Error('Server error'));

            const res = await request(app)
                .get(`/user/parks/${parkId}`)
                .set('user', JSON.stringify({ id: userId }));

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to check park');
        });
    });
});