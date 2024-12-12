// 1. Mock Dependencies Before Importing Routes
jest.mock('passport', () => ({
    authenticate: jest.fn(() => (req, res, next) => {
        // Simulate Passport setting req.user
        req.user = {
            id: 'testGoogleId',
            emails: [{ value: 'test@test.com' }],
            displayName: 'Test User',
            photos: [{ value: 'http://example.com/photo.jpg' }],
            accessToken: 'mockAccessToken',
        };
        next();
    }),
}));

jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

// 2. Import After Mocking
const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const passport = require('passport'); // This is the mocked version
const authRoutes = require('../routes/authRoutes'); // Adjust the path if necessary
const User = require('../models/userModel');

describe('authController.googleCallback', () => {
    let app;

    beforeAll(() => {
        // Initialize Express App
        app = express();

        // Middleware to parse JSON (if needed)
        app.use(express.json());

        // Mock Environment Variables
        process.env.JWT_SECRET = 'testsecret';
        process.env.VERCEL_ENV = 'development'; // Adjust as needed

        // Mount the Auth Routes
        app.use('/', authRoutes);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should redirect with a token if user is authenticated', async () => {
        // Mock user data
        const mockUser = {
            _id: '12345',
            googleId: 'testGoogleId',
            email: 'test@test.com',
            name: 'Test User',
            profilePic: 'http://example.com/photo.jpg',
            accessToken: 'mockAccessToken',
            save: jest.fn().mockResolvedValue(true),
        };

        // Mock database calls
        User.findOne.mockResolvedValue(null); // Simulate user not found
        User.mockImplementation(() => mockUser); // Simulate new user instance

        // Mock JWT signing
        jwt.sign.mockReturnValue('mockToken');

        // Make the GET request to the callback route
        const res = await request(app)
            .get('/api/auth/google/callback')
            .expect(302); // Expect a redirect

        // Determine the expected redirect URL based on VERCEL_ENV
        const expectedRedirectUrl = `http://localhost:3000?token=mockToken`;

        // Assert that the redirect URL contains the mock token
        expect(res.headers.location).toBe(expectedRedirectUrl);

        // Assertions to ensure methods were called correctly
        expect(User.findOne).toHaveBeenCalledWith({ googleId: 'testGoogleId' });
        expect(mockUser.save).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, email: mockUser.email },
            'testsecret',
            { expiresIn: '30d' }
        );
    });

    it('should redirect to production URL with token when VERCEL_ENV is production', async () => {
        // Update the environment variable for production
        process.env.VERCEL_ENV = 'production';

        // Mock user data
        const mockUser = {
            _id: '12345',
            googleId: 'testGoogleId',
            email: 'test@test.com',
            name: 'Test User',
            profilePic: 'http://example.com/photo.jpg',
            accessToken: 'mockAccessToken',
            save: jest.fn().mockResolvedValue(true),
        };

        // Mock database calls
        User.findOne.mockResolvedValue(mockUser); // Simulate existing user

        // Mock JWT signing
        jwt.sign.mockReturnValue('mockToken');

        // Make the GET request to the callback route
        const res = await request(app)
            .get('/api/auth/google/callback')
            .expect(302); // Expect a redirect

        // Expected redirect URL for production
        const expectedRedirectUrl = `https://trailmix.haojin.li?token=mockToken`;

        // Assert that the redirect URL is correct
        expect(res.headers.location).toBe(expectedRedirectUrl);

        // Assertions to ensure methods were called correctly
        expect(User.findOne).toHaveBeenCalledWith({ googleId: 'testGoogleId' });
        expect(mockUser.save).toHaveBeenCalled(); // Access token update
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, email: mockUser.email },
            'testsecret',
            { expiresIn: '30d' }
        );
    });

    it('should return 500 on server error', async () => {
        // Simulate a server error
        User.findOne.mockRejectedValue(new Error('Database error'));

        // Make the GET request to the callback route
        const res = await request(app)
            .get('/api/auth/google/callback')
            .expect(500);

        // Assert that the response body contains the error message
        expect(res.body).toEqual({ error: 'Server error during authentication' });
    });
});