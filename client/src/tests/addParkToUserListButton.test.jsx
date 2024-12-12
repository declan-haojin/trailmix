import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import ParkListButton from '../components/addParkToUserListButton';

jest.mock('axios');

describe('ParkListButton', () => {
    const parkId = '123';

    beforeAll(() => {
        window.alert = jest.fn();
    });

    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
        axios.delete.mockClear();
    });

    it('renders Add Park to My List button initially', async () => {
        axios.get.mockResolvedValue({ data: { exists: false } });

        render(
            <MemoryRouter>
                <ParkListButton parkId={parkId} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Add Park to My List')).toBeInTheDocument();
        });
    });

    it('renders Remove Park from My List button if park is in list', async () => {
        axios.get.mockResolvedValue({ data: { exists: true } });

        render(
            <MemoryRouter>
                <ParkListButton parkId={parkId} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Remove Park from My List')).toBeInTheDocument();
        });
    });

    it('calls axios.post when Add Park to My List button is clicked', async () => {
        axios.get.mockResolvedValue({ data: { exists: false } });
        axios.post.mockResolvedValue({});

        render(
            <MemoryRouter>
                <ParkListButton parkId={parkId} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Add Park to My List')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Add Park to My List'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/lists/add', { parkId: parkId }, { withCredentials: true });
        });
    });

    it('calls axios.delete when Remove Park from My List button is clicked', async () => {
        axios.get.mockResolvedValue({ data: { exists: true } });
        axios.delete.mockResolvedValue({});

        render(
            <MemoryRouter>
                <ParkListButton parkId={parkId} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Remove Park from My List')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Remove Park from My List'));

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(`/api/lists/remove/${parkId}`, { withCredentials: true });
        });
    });
});