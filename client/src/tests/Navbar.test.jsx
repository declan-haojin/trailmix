import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar Component', () => {
    const getSignUpLink = jest.fn(() => 'http://signup-link.com');

    it('renders TrailMix logo link', () => {
        const { getByText } = render(
            <Router>
                <Navbar isAuthenticated={false} getSignUpLink={getSignUpLink} />
            </Router>
        );
        const logoLink = getByText('TrailMix');
        expect(logoLink).toBeInTheDocument();
        expect(logoLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders All Parks and My Parks links', () => {
        const { getByText } = render(
            <Router>
                <Navbar isAuthenticated={false} getSignUpLink={getSignUpLink} />
            </Router>
        );
        expect(getByText('All Parks')).toBeInTheDocument();
        expect(getByText('My Parks')).toBeInTheDocument();
    });

    it('renders Log In and Sign Up links when not authenticated', () => {
        const { getByText } = render(
            <Router>
                <Navbar isAuthenticated={false} getSignUpLink={getSignUpLink} />
            </Router>
        );
        expect(getByText('Log In')).toBeInTheDocument();
        expect(getByText('Sign Up')).toBeInTheDocument();
    });

    it('renders Profile button when authenticated', () => {
        const { getByText } = render(
            <Router>
                <Navbar isAuthenticated={true} getSignUpLink={getSignUpLink} />
            </Router>
        );
        expect(getByText('Profile')).toBeInTheDocument();
    });
});