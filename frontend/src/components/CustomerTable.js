import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import SortOptions from './SortOptions';

const bu = "http://localhost:3001";

const CustomerTable = () => {
    const [customers, setCustomers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('DESC');

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, searchTerm, sortBy, sortOrder]); // This ensures useEffect runs whenever these dependencies change

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${bu}/api/customers?page=${currentPage}&search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            const updatedCustomers = response.data.data.map((customer, index) => ({
                ...customer,
                serialNumber: index + 1,
                time: `${customer.hour}:${customer.minute}:${customer.second}`
            }));
            setCustomers(updatedCustomers);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSort = (sortBy, sortOrder) => {
        setSortBy(sortBy);
        setSortOrder(sortOrder);
        setCurrentPage(1); // Reset to first page when sorting
    };

    return (
        <div>
            <h1>Customer Table</h1>
            <SearchBar onSearch={handleSearch} />
            <SortOptions onSort={handleSort} />
            <table>
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Customer Name</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.sno}>
                            <td>{customer.serialNumber}</td>
                            <td>{customer.customer_name}</td>
                            <td>{customer.age}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.location}</td>
                            <td>{customer.date}</td>
                            <td>{customer.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CustomerTable;
