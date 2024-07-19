const { Pool } = require('pg');

//postgres connection
const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',              
    database: 'postgres', 
    password: 'V.1.j.a.y',      
    port: 5432,                     
  });

// Function to test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the PostgreSQL database!');
    client.release();
  } catch (err) {
    console.error('Error connecting to the PostgreSQL database:', err);
  }
};

// Export the pool instance and test function
module.exports = { pool, testConnection };

// Call the test connection function
testConnection();
