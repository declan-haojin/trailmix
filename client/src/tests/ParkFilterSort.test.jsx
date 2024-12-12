import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ParkFilterSort from '../components/ParkFilterSort';

describe('ParkFilterSort Component', () => {
    const mockSelectByCriteria = jest.fn();

    beforeEach(() => {
        mockSelectByCriteria.mockClear();
    });

    test('renders correctly with initial state', () => {
        const { getByLabelText, getByText } = render(<ParkFilterSort selectByCriteria={mockSelectByCriteria} />);
        
        expect(getByLabelText('Select a state')).toBeInTheDocument();
        expect(getByLabelText('Select sorting criteria')).toBeInTheDocument();
        expect(getByText('Select a State')).toBeInTheDocument();
        expect(getByText('Select Sorting Criteria')).toBeInTheDocument();
    });

    test('calls selectByCriteria with correct state when state is selected', () => {
        const { getByLabelText } = render(<ParkFilterSort selectByCriteria={mockSelectByCriteria} />);
        
        fireEvent.change(getByLabelText('Select a state'), { target: { value: 'CA' } });
        
        expect(mockSelectByCriteria).toHaveBeenCalledWith('CA', '');
    });

    test('calls selectByCriteria with correct sort option when sort option is selected', () => {
        const { getByLabelText } = render(<ParkFilterSort selectByCriteria={mockSelectByCriteria} />);
        
        fireEvent.change(getByLabelText('Select sorting criteria'), { target: { value: 'averageRating' } });
        
        expect(mockSelectByCriteria).toHaveBeenCalledWith('', 'averageRating');
    });

    test('calls selectByCriteria with correct state and sort option when both are selected', () => {
        const { getByLabelText } = render(<ParkFilterSort selectByCriteria={mockSelectByCriteria} />);
        
        fireEvent.change(getByLabelText('Select a state'), { target: { value: 'CA' } });
        fireEvent.change(getByLabelText('Select sorting criteria'), { target: { value: 'averageRating' } });
        
        expect(mockSelectByCriteria).toHaveBeenCalledWith('CA', 'averageRating');
    });
});