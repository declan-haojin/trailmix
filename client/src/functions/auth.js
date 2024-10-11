import {getCookie, setCookie} from './cookie';

export const extractTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        setCookie('jwtToken', token, 30); // Store token for 30 days
        window.history.replaceState(null, null, window.location.pathname);
    }
};

export const checkAuthentication = () => {
    const token = getCookie('jwtToken'); // Check if jwtToken exists in the cookies
    return !!token; // Return true if token exists
};

export const getSignUpLink = () => {
    const env = process.env.REACT_APP_VERCEL_ENV;
    if (env === 'production') {
        return 'https://trailmix.haojin.li/api/auth/google';
    } else if (env === 'preview') {
        return 'https://trailmix-client-declan-haojin-haojin.vercel.app/api/auth/google';
    } else {
        return 'http://localhost:3001/api/auth/google';
    }
};
