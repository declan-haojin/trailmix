// controllers/commentController.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Comment = require('../models/commentModel'); // Adjust the path as necessary
const NationalPark = require('../models/nationalParkModel'); // Adjust the path as necessary
const User = require('../models/userModel'); // Adjust the path as necessary
const commentController = require('../controllers/commentController'); // Adjust the path as necessary

// Increase Jest's timeout for potentially longer-running tests
jest.setTimeout(30000); // 30 seconds

// Mock the authentication middleware before importing routes
jest.mock('../middlewares/authMiddleware', () => {
  return jest.fn((req, _res, next) => {
    req.user = { id: global.testUserId.toString() }; // Set to a global test user ID
    next();
  });
});
const authenticateJWT = require('../middlewares/authMiddleware');

// Mock the upload middleware
jest.mock('../middlewares/uploadMiddleware', () => ({
  upload: jest.fn((req, _res, next) => {
    req.files = []; // Set to an empty array or provide mock files if needed
    next();
  }),
  uploadToR2: jest.fn().mockResolvedValue({ Location: 'http://mocked-url.com/image.jpg' }),
}));
const { upload } = require('../middlewares/uploadMiddleware');

// Initialize Express app
const app = express();
app.use(express.json());

// Define routes with mocked middlewares
app.post('/comments/:parkId', authenticateJWT, upload, commentController.createComment);
app.get('/comments/:parkId', commentController.getCommentsByPark);
app.put('/comments/:commentId', authenticateJWT, commentController.updateComment);
app.delete('/comments/:commentId', authenticateJWT, commentController.deleteComment);

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      profilePic: 'http://example.com/profile.jpg',
      googleId: 'test-google-id', // Required field
    });
    await testUser.save();
    global.testUserId = testUser._id; // Accessible in mocked middleware
  } catch (error) {
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  } catch (error) {
    throw error;
  }
});

afterEach(async () => {
  try {
    await Comment.deleteMany({});
    await NationalPark.deleteMany({});
    await User.deleteMany({});

    // Re-create the test user after each test
    const testUser = new User({
      _id: global.testUserId, // Reuse the same ID
      name: 'Test User',
      email: 'testuser@example.com',
      profilePic: 'http://example.com/profile.jpg',
      googleId: 'test-google-id', // Ensure googleId is provided
    });
    await testUser.save();
  } catch (error) {
    throw error;
  }
});

describe('Comment Controller', () => {
  it('should create a comment and update park ratings', async () => {
    const park = new NationalPark({
      park_code: 'YNP',
      name: 'Yellowstone',
      states: 'WY',
      description: 'First national park',
      numRatings: 2,
      cumulativeRating: 8,
    });
    await park.save();

    const res = await request(app)
      .post(`/comments/${park._id}`)
      .send({
        rating: 5,
        comment: 'Beautiful park!',
      })
      .set('Authorization', `Bearer valid-token`); // Authorization header is mocked

    expect(res.status).toBe(201);
    expect(res.body.comment.comment).toBe('Beautiful park!');
    expect(res.body.numRatings).toBe(3);
    expect(res.body.averageRating).toBeCloseTo(4.33, 2); // (8 + 5) / 3 = 4.333...
  });

  it('should return 404 when creating a comment for a non-existent park', async () => {
    const nonExistentParkId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/comments/${nonExistentParkId}`)
      .send({
        rating: 5,
        comment: 'Great park!',
      })
      .set('Authorization', `Bearer valid-token`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('National Park not found');
  });

  it('should fetch all comments for a specific park', async () => {
    const park = new NationalPark({
      park_code: 'YNP',
      name: 'Yellowstone',
      states: 'WY',
      description: 'First national park',
    });
    await park.save();

    const user1 = new User({
      name: 'User One',
      email: 'userone@example.com',
      profilePic: 'http://example.com/userone.jpg',
      googleId: 'user1-google-id', // Required field
    });
    const user2 = new User({
      name: 'User Two',
      email: 'usertwo@example.com',
      profilePic: 'http://example.com/usertwo.jpg',
      googleId: 'user2-google-id', // Required field
    });
    await user1.save();
    await user2.save();

    const comment1 = new Comment({
      park: park._id,
      user: user1._id,
      rating: 4,
      comment: 'Amazing park!',
    });
    const comment2 = new Comment({
      park: park._id,
      user: user2._id,
      rating: 5,
      comment: 'Had a great time!',
    });
    await comment1.save();
    await comment2.save();

    const res = await request(app).get(`/comments/${park._id}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    // Assuming comments are sorted by createdAt descending
    expect(res.body[0].comment).toBe('Had a great time!');
    expect(res.body[1].comment).toBe('Amazing park!');
  });

  it('should update a comment', async () => {
    const park = new NationalPark({
      park_code: 'YNP',
      name: 'Yellowstone',
      states: 'WY',
      description: 'First national park',
    });
    await park.save();

    // Create a comment by the test user
    const comment = new Comment({
      park: park._id,
      user: global.testUserId,
      rating: 4,
      comment: 'Nice park',
    });
    await comment.save();

    const res = await request(app)
      .put(`/comments/${comment._id}`)
      .send({ rating: 5, comment: 'Updated comment' })
      .set('Authorization', `Bearer valid-token`);

    expect(res.status).toBe(200);
    expect(res.body.rating).toBe(5);
    expect(res.body.comment).toBe('Updated comment');
  });

  it('should return 404 when deleting a non-existent comment', async () => {
    const nonExistentCommentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/comments/${nonExistentCommentId}`)
      .set('Authorization', `Bearer valid-token`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Comment not found');
  });
});
