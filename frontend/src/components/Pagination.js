// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalCount, onPageChange }) => {
    const totalPages = Math.ceil(totalCount / 20); // Assuming 20 records per page

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    return (
        <div>
            <button onClick={() => handlePageClick(currentPage - 1)}>Previous</button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={() => handlePageClick(currentPage + 1)}>Next</button>
        </div>
    );
};

export default Pagination;
