require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  family: 4,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    await client.connect();

    console.log('✅ Connected successfully');

    const res = await client.query('SELECT NOW()');

    console.log(res.rows);

    await client.end();

  } catch (err) {
    console.error('❌ Failed:', err);
  }
}

test();
