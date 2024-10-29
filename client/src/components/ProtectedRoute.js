import React from 'react';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({isAuthenticated, children}) => {
    if (!isAuthenticated) {
        // If not authenticated, redirect to the home page
        return <Navigate to="/" replace/>;
    }

    // If authenticated, render the child component (e.g., Profile page)
    return children;
};

export default ProtectedRoute;