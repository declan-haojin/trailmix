const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Comment Model Test', () => {
    it('create & save comment successfully', async () => {
        const validComment = new Comment({
            park: new mongoose.Types.ObjectId(),
            user: new mongoose.Types.ObjectId(),
            rating: 4,
            comment: 'Great park!',
            images: ['image1.jpg', 'image2.jpg']
        });
        const savedComment = await validComment.save();
        expect(savedComment._id).toBeDefined();
        expect(savedComment.rating).toBe(4);
        expect(savedComment.comment).toBe('Great park!');
        expect(savedComment.images).toEqual(expect.arrayContaining(['image1.jpg', 'image2.jpg']));
    });

    it('insert comment successfully, but the field does not defined in schema should be undefined', async () => {
        const commentWithInvalidField = new Comment({
            park: new mongoose.Types.ObjectId(),
            user: new mongoose.Types.ObjectId(),
            rating: 4,
            comment: 'Great park!',
            images: ['image1.jpg', 'image2.jpg'],
            extraField: 'This field is not defined in schema'
        });
        const savedComment = await commentWithInvalidField.save();
        expect(savedComment._id).toBeDefined();
        expect(savedComment.extraField).toBeUndefined();
    });

    it('create comment without required field should fail', async () => {
        const commentWithoutRequiredField = new Comment({
            user: new mongoose.Types.ObjectId(),
            rating: 4,
            comment: 'Great park!'
        });
        let err;
        try {
            const savedCommentWithoutRequiredField = await commentWithoutRequiredField.save();
            err = savedCommentWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.park).toBeDefined();
    });
});