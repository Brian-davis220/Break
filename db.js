const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error acquiring client', err.stack);
    }
    console.log('🐘 Successfully connected to Neon Database');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
