import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AllParks from '../pages/AllParks';
import { getAllParks, getParksByCriteria } from '../functions/api';

// Mock the API functions
jest.mock('../functions/api', () => ({
  getAllParks: jest.fn(),
  getParksByCriteria: jest.fn(),
}));

describe('AllParks Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getAllParks.mockResolvedValue([]);
    getParksByCriteria.mockResolvedValue([]);
  });

  it('fetches and displays parks on initial load', async () => {
    getAllParks.mockResolvedValue([
      {
        park_code: 'ARC',
        name: 'Arches',
        image: 'image.jpg',
        states: 'TX',
        description: 'Description',
        numRatings: 10,
        cumulativeRating: 40,
      },
    ]);

    render(
      <MemoryRouter>
        <AllParks />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading parks/i)).toBeInTheDocument();
    await waitFor(() => expect(getAllParks).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/Arches/i)).toBeInTheDocument();
  });

  it('filters parks when selectByCriteria is called', async () => {
    getParksByCriteria.mockResolvedValue([
      {
        park_code: 'ZNP',
        name: 'Zion',
        image: 'image2.jpg',
        states: 'UT',
        description: 'Description',
        numRatings: 20,
        cumulativeRating: 90,
      },
    ]);

    render(
      <MemoryRouter>
        <AllParks />
      </MemoryRouter>
    );

    const stateSelect = await screen.findByLabelText(/Filter by State/i);
    fireEvent.change(stateSelect, { target: { value: 'UT' } });

    await waitFor(() => expect(getParksByCriteria).toHaveBeenCalledWith('UT', ''));
    expect(await screen.findByText(/Zion/i)).toBeInTheDocument();
    expect(screen.queryByText(/Arches/i)).not.toBeInTheDocument();
  });

  it('shows a message when no parks are found', async () => {
    render(
      <MemoryRouter>
        <AllParks />
      </MemoryRouter>
    );

    const stateSelect = await screen.findByLabelText(/Filter by State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });

    await waitFor(() => expect(getParksByCriteria).toHaveBeenCalledWith('AL', ''));
    expect(await screen.findByText(/No parks found/i)).toBeInTheDocument();
  });
});
