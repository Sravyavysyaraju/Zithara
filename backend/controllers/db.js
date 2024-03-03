// db.js
const { Pool } = require('pg');

// Replace the following values with your PostgreSQL connection details
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db1',
  password: 'Sravya$2k03',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
