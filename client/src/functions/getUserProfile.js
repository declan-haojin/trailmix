import axios from 'axios';

export const getUserProfile = async () => {
    try {
        // Await the axios request and return the data
        const response = await axios.get('/api/user/profile', {withCredentials: true});
        return response.data;
    } catch (err) {
        console.error('Error fetching user profile:', err);
        throw err;  // Re-throw the error for the calling function to handle
    }
};