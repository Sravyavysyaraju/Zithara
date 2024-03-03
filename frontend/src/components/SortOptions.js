// SortOptions.js
import React, { useState } from 'react';

const SortOptions = ({ onSort }) => {
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('DESC');

    const handleSort = () => {
        onSort(sortBy, sortOrder);
    };

    return (
        <div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="created_at">Date</option>
                <option value="time">Time</option>
                {/* Add more options if needed */}
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
            </select>
            <button onClick={handleSort}>Sort</button>
        </div>
    );
};

export default SortOptions;
