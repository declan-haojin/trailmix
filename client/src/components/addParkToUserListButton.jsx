import React from 'react';
import axios from 'axios';

function addParkToUserListButton({ parkId }) {
    const handleAddPark = async () => {
        try {
            const response = await axios.post('/api/lists/add', {
                parkId: parkId,
            }, {withCredentials: true});
            alert(response.data.message); // Notify the user of success
        } catch (error) {
            console.error('Error adding park:', error);
            alert('Failed to add park to the list.');
        }
    };

    return (
        <button onClick={handleAddPark}>
            Add Park to My List
        </button>
    );
}

export default addParkToUserListButton;