import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import MyParks from '../pages/MyParks';
import { getUserParkList } from '../functions/api';

jest.mock('../functions/api');

describe('MyParks', () => {
    test('renders loading state initially', () => {
        getUserParkList.mockResolvedValue([]);
        render(
            <Router>
                <MyParks />
            </Router>
        );
        expect(screen.getByText('Loading parks...')).toBeInTheDocument();
    });

    test('renders no parks message when user has no parks', async () => {
        getUserParkList.mockResolvedValue([]);
        render(
            <Router>
                <MyParks />
            </Router>
        );
        await waitFor(() => expect(screen.getByText("You haven't added any parks to your list yet!")).toBeInTheDocument());
    });

    test('renders parks when user has parks', async () => {
        const parks = [
            {
                id: '1',
                _id: '1',
                park_code: 'park1',
                image: 'image1.jpg',
                name: 'Park 1 National Park',
                numRatings: 10,
                cumulativeRating: 40,
            },
            {
                id: '2',
                _id: '2',
                park_code: 'park2',
                image: 'image2.jpg',
                name: 'Park 2 National Park',
                numRatings: 5,
                cumulativeRating: 25,
            },
        ];
        getUserParkList.mockResolvedValue(parks);
        render(
            <Router>
                <MyParks />
            </Router>
        );
        await waitFor(() => expect(screen.getByText('Park 1')).toBeInTheDocument());
        expect(screen.getByText('Rating : 4.00')).toBeInTheDocument();
        expect(screen.getByText('Reviews : 10')).toBeInTheDocument();
        expect(screen.getByText('Park 2')).toBeInTheDocument();
        expect(screen.getByText('Rating : 5.00')).toBeInTheDocument();
        expect(screen.getByText('Reviews : 5')).toBeInTheDocument();
    });

    test('handles error state', async () => {
        getUserParkList.mockRejectedValue(new Error('Failed to fetch'));
        render(
            <Router>
                <MyParks />
            </Router>
        );
        await waitFor(() => expect(screen.getByText("You haven't added any parks to your list yet!")).toBeInTheDocument());
    });
});