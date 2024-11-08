import React, { useState } from 'react';

const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 
    'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 
    'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 
    'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 
    'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 
    'WI', 'WY'
];

const ParkFilterSort = ({ selectByCriteria }) => {
    const [selectedState, setSelectedState] = useState('');
    const [sortBy, setSortBy] = useState('');

    const handleStateChange = (event) => {
        const state = event.target.value;
        setSelectedState(state);
        selectByCriteria(state, sortBy);
    };

    const handleSortChange = (event) => {
        const sortOption = event.target.value;
        setSortBy(sortOption);
        selectByCriteria(selectedState, sortOption);
    };

    return (
        <div className="grid">
            <div>
                <label htmlFor="state-select">Filter by State:</label>
                <select
                    id="state-select"
                    value={selectedState}
                    onChange={handleStateChange}
                    aria-label="Select a state"
                    required
                >
                    <option value="">
                        Select a State
                    </option>
                    {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="sort-select">Sort by:</label>
                <select
                    id="sort-select"
                    value={sortBy}
                    onChange={handleSortChange}
                    aria-label="Select sorting criteria"
                    required
                >
                    <option value="">
                        Select Sorting Criteria
                    </option>
                    <option value="cumulativeRating">Cumulative Rating</option>
                    <option value="numRatings">Number of Ratings</option>
                </select>
            </div>
        </div>
    );
};

export default ParkFilterSort;