import { getARandomPark, getParkByCode, getCommentsByPark, getAllParks, getParks, getParksByCriteria, getUserProfile, logoutGoogle, getARandomFunFact, getFunFactsByParkID, getUserParkList } from '../functions/api';
import axios from 'axios';
import fetch from 'jest-fetch-mock';

jest.mock('axios');
fetch.enableMocks();

describe('API functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getARandomPark fetches a random park', async () => {
        const mockResponse = { name: 'Yellowstone' };
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getARandomPark();
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks/random", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
    });

    test('getParkByCode fetches park data by code', async () => {
        const mockResponse = { name: 'Yosemite' };
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getParkByCode('yose');
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks/yose");
    });

    test('getCommentsByPark fetches comments by park ID', async () => {
        const mockResponse = [{ comment: 'Beautiful park!' }];
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getCommentsByPark('123');
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/comments/123");
    });

    test('getAllParks fetches all parks', async () => {
        const mockResponse = [{ name: 'Yellowstone' }];
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getAllParks();
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
    });

    test('getParks fetches parks', async () => {
        const mockResponse = [{ name: 'Yellowstone' }];
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getParks();
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
    });

    test('getParksByCriteria fetches parks by criteria', async () => {
        const mockResponse = [{ name: 'Yellowstone' }];
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getParksByCriteria('CA', 'name');
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks?state=CA&sortBy=name", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
    });

    test('getUserProfile fetches user profile', async () => {
        const mockResponse = { username: 'john_doe' };
        axios.get.mockResolvedValueOnce({ data: mockResponse });

        const result = await getUserProfile();
        expect(result).toEqual(mockResponse);
        expect(axios.get).toHaveBeenCalledWith('/api/user/profile', { withCredentials: true });
    });

    test('logoutGoogle logs out user from Google', async () => {
        const mockResponse = { success: true };
        axios.post.mockResolvedValueOnce({ data: mockResponse });

        const result = await logoutGoogle();
        expect(result).toEqual(mockResponse);
        expect(axios.post).toHaveBeenCalledWith('/api/auth/google/logout', { withCredentials: true });
    });

    test('getARandomFunFact fetches a random fun fact', async () => {
        const mockResponse = { fact: 'Yellowstone is the first national park.' };
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getARandomFunFact();
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks/funfacts/random");
    });

    test('getFunFactsByParkID fetches fun facts by park ID', async () => {
        const mockResponse = [{ fact: 'Yellowstone is the first national park.' }];
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const result = await getFunFactsByParkID('123');
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/parks/funfacts/123");
    });

    test('getUserParkList fetches user park list', async () => {
        const mockResponse = [{ name: 'Yellowstone' }];
        axios.get.mockResolvedValueOnce({ data: mockResponse });

        const result = await getUserParkList();
        expect(result).toEqual(mockResponse);
        expect(axios.get).toHaveBeenCalledWith('/api/lists', { withCredentials: true });
    });
});