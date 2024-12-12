const mongoose = require('mongoose');
const UserParkList = require('../models/userParkListModel');
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

describe('UserParkList Model Test', () => {
    it('should create and save a user park list successfully', async () => {
        const validUserParkList = new UserParkList({
            park: new mongoose.Types.ObjectId(),
            user: new mongoose.Types.ObjectId(),
        });
        const savedUserParkList = await validUserParkList.save();
        
        expect(savedUserParkList._id).toBeDefined();
        expect(savedUserParkList.park).toBe(validUserParkList.park);
        expect(savedUserParkList.user).toBe(validUserParkList.user);
        expect(savedUserParkList.timestamp).toBeDefined();
    });

    it('should fail to create a user park list without required fields', async () => {
        const userParkListWithoutRequiredField = new UserParkList({});
        let err;
        try {
            await userParkListWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.park).toBeDefined();
        expect(err.errors.user).toBeDefined();
    });
});