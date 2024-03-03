// customerController.js
const pool = require('./db');

const getAllCustomers = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Searching
        const searchTerm = req.query.search;
        let searchQuery = '';
        if (searchTerm) {
            searchQuery = `WHERE customer_name ILIKE '%${searchTerm}%' OR location ILIKE '%${searchTerm}%'`;
        }

        // Sorting
        const sortBy = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder || 'DESC';

        const query = `
        SELECT sno, customer_name, age, phone, location, 
               TO_CHAR(created_at, 'DD/MM/YYYY') AS date,
               EXTRACT(HOUR FROM created_at) AS hour,
               EXTRACT(MINUTE FROM created_at) AS minute,
               EXTRACT(SECOND FROM created_at) AS second
        FROM customers
        ${searchQuery}
        ORDER BY 
            ${sortBy === 'hour' ? 'hour' : sortBy === 'minute' ? 'minute' : sortBy === 'second' ? 'second' : 'created_at'}
            ${sortOrder}
        LIMIT ${limit} OFFSET ${offset};
    `;


        const { rows } = await pool.query(query);

        // Get total count for pagination
        const totalCountQuery = `SELECT COUNT(*) AS total FROM customers ${searchQuery};`;
        const totalCount = (await pool.query(totalCountQuery)).rows[0].total;

        res.status(200).json({
            success: true,
            data: rows,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// Get a customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM customers WHERE sno = $1';
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const { customer_name, age, phone, location } = req.body;
        const query = `
            INSERT INTO customers (customer_name, age, phone, location)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [customer_name, age, phone, location];
        const { rows } = await pool.query(query, values);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// Update an existing customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_name, age, phone, location } = req.body;
        const query = `
            UPDATE customers
            SET customer_name = $1, age = $2, phone = $3, location = $4
            WHERE sno = $5
            RETURNING *;
        `;
        const values = [customer_name, age, phone, location, id];
        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// Delete an existing customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM customers WHERE sno = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
