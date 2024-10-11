import axios from 'axios';

export const getARandomPark = async () => {
    try {
        const response = await fetch("/api/parks/random", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await response.json();
    } catch (err) {
    }
}

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