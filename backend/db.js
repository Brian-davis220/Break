const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(client => {
        console.log('🐘 Successfully connected to Neon Database');
        client.release();
    })
    .catch(err => {
        console.error('❌ Database connection error:', err);
    });

module.exports = pool;