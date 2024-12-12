import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import CommentModal from '../components/CommentModal';

describe('CommentModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
        commentData: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render when closed', () => {
        render(
            <MemoryRouter>
                <CommentModal {...defaultProps} isOpen={false} />
            </MemoryRouter>
        );
        expect(screen.queryByText('Leave a Comment')).not.toBeInTheDocument();
    });

    it('populates fields when editing an existing comment', () => {
        const commentData = {
            comment: 'Test comment',
            rating: 4,
            images: [],
        };
        render(
            <MemoryRouter>
                <CommentModal {...defaultProps} commentData={commentData} />
            </MemoryRouter>
        );
        expect(screen.getByText('Edit Your Comment')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test comment')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <MemoryRouter>
                <CommentModal {...defaultProps} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Close'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSubmit with form data when form is submitted', () => {
        render(
            <MemoryRouter>
                <CommentModal {...defaultProps} />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByLabelText('Comment:'), { target: { value: 'New comment' } });
        fireEvent.submit(screen.getByRole('button', { name: /submit comment/i }));
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        const formData = mockOnSubmit.mock.calls[0][0];
        expect(formData.get('comment')).toBe('New comment');
        expect(formData.get('rating')).toBe('5');
    });

    it('calls onClose after form submission', () => {
        render(
            <MemoryRouter>
                <CommentModal {...defaultProps} />
            </MemoryRouter>
        );
        fireEvent.submit(screen.getByRole('button', { name: /submit comment/i }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});