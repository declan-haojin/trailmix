const request = require('supertest');
const express = require('express');
const commentRoutes = require('../routes/commentRoutes');

const app = express();

app.use(express.json());
app.use('/comments', commentRoutes);

jest.mock('../controllers/commentController', () => ({
    createComment: jest.fn((req, res) => res.status(201).send('Comment created')),
    getCommentsByPark: jest.fn((req, res) => res.status(200).send('Comments retrieved')),
    updateComment: jest.fn((req, res) => res.status(200).send('Comment updated')),
    deleteComment: jest.fn((req, res) => res.status(200).send('Comment deleted'))
}));

jest.mock('../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../middlewares/uploadMiddleware', () => ({
    upload: jest.fn((req, res, next) => next())
}));

describe('Comment Routes', () => {
    it('should create a new comment', async () => {
        const response = await request(app)
            .post('/comments/1')
            .send({ text: 'Great park!' });
        expect(response.status).toBe(201);
        expect(response.text).toBe('Comment created');
    });

    it('should get all comments for a specific park', async () => {
        const response = await request(app)
            .get('/comments/1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Comments retrieved');
    });

    it('should update a comment', async () => {
        const response = await request(app)
            .put('/comments/1')
            .send({ text: 'Updated comment' });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Comment updated');
    });

    it('should delete a comment', async () => {
        const response = await request(app)
            .delete('/comments/1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Comment deleted');
    });
});