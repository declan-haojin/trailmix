import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ParkListButton({ parkId }) {
    const [isParkInList, setIsParkInList] = useState(false);

    useEffect(() => {
        const checkParkInList = async () => {
            try {
                const response = await axios.get(`/api/lists/exists/${parkId}`, { withCredentials: true });
                setIsParkInList(response.data.exists); // Update state based on response
            } catch (error) {
                console.error('Error checking park in user list:', error);
            }
        };

        checkParkInList();
    }, [parkId]);

    const handleAddPark = async () => {
        try {
            const response = await axios.post(
                '/api/lists/add',
                { parkId },
                { withCredentials: true }
            );
            alert(response.data.message); // Notify the user of success
            setIsParkInList(true); // Switch to "Remove" button
        } catch (error) {
            console.error('Error adding park:', error);
            alert('Failed to add park to the list. You may need to login first.');
        }
    };

    const handleRemovePark = async () => {
        try {
            const response = await axios.delete(`/api/lists/remove/${parkId}`, { withCredentials: true });
            alert(response.data.message); // Notify the user of success
            setIsParkInList(false); // Switch to "Add" button
        } catch (error) {
            console.error('Error removing park:', error);
            alert('Failed to remove park from the list.');
        }
    };

    return (
        <button onClick={isParkInList ? handleRemovePark : handleAddPark}>
            {isParkInList ? 'Remove Park from My List' : 'Add Park to My List'}
        </button>
    );
}

export default ParkListButton;