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
        console.error('Error fetching a random park:', err);
        throw err;
    }
}

export const getParkByCode = async (parkCode) => {
    try {
        const response = await fetch(`/api/parks/${parkCode}`);
        return await response.json();
    } catch (err) {
        console.error('Error fetching park data:', err);
        throw err;
    }
}

export const getCommentsByPark = async (parkId) => {
    try {
        const response = await fetch(`/api/comments/${parkId}`);
        return await response.json();
    } catch (err) {
        console.error('Error fetching comments:', err);
        throw err;
    }
}

export const getAllParks = async () => {
    try {
        const response = await fetch("/api/parks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await response.json();
    } catch (err) {
        console.error('Error fetching all parks:', err);
        throw err;
    }
}

export const getParks = async () => {
    try {
        const response = await fetch("/api/parks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await response.json();
    } catch (err) {
    }
}

export const getParksByCriteria = async (state, sortBy = '') => {
    try {
        const query = new URLSearchParams();
        if (state) query.append('state', state);
        if (sortBy) query.append('sortBy', sortBy);

        const response = await fetch(`/api/parks?${query.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await response.json();
    } catch (err) {
        console.error('Failed to fetch parks by criteria:', err);
    }
};

export const getUserProfile = async () => {
    try {
        const response = await axios.get('/api/user/profile', {withCredentials: true});
        return response.data;
    } catch (err) {
        console.error('Error fetching user profile:', err);
        throw err;  // Re-throw the error for the calling function to handle
    }
};

export const logoutGoogle = async () => {
    try {
        const response = await axios.post('/api/auth/google/logout', {withCredentials: true});
        return response.data;
    } catch (err) {
        console.error('Error logoutGoogle:', err);
        throw err;
    }
}

export const getARandomFunFact = async () => {
    try {
      const response = await fetch(`/api/parks/funfacts/random`);
      return await response.json();
    } catch (err) {
      console.error('Error fetching a random fun fact:', err);
      throw err;
    }
};

export const getFunFactsByParkID = async (parkID) => {
    try {
      const response = await fetch(`/api/parks/funfacts/${parkID}`);
      return await response.json();
    } catch (err) {
      console.error('Error fetching fun facts by Park ID:', err);
      throw err;
    }
};

export const getUserParkList = async () => {
    try {
        const response = await axios.get('/api/lists', {withCredentials: true});
        return response.data;
    } catch (err) {
        console.error('Error fetching user park list:', err);
        throw err;
    }
}
