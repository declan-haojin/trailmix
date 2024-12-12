import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from '../components/UserProfile';

describe('UserProfile Component', () => {
    const profile = {
        profilePic: 'https://example.com/profile.jpg',
        name: 'John Doe',
        email: 'john.doe@example.com'
    };

    test('renders profile picture', () => {
        const { getByAltText } = render(<UserProfile profile={profile} />);
        const imgElement = getByAltText("John Doe's profile");
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', profile.profilePic);
    });

    test('renders profile name', () => {
        const { getByText } = render(<UserProfile profile={profile} />);
        const nameElement = getByText('John Doe');
        expect(nameElement).toBeInTheDocument();
    });

    test('renders profile email', () => {
        const { getByText } = render(<UserProfile profile={profile} />);
        const emailElement = getByText('john.doe@example.com');
        expect(emailElement).toBeInTheDocument();
    });
});