const pg = require('pg');
require('dotenv').config();

async function getUserByUsername(username) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows[0];
    } finally {
        client.release();
    }
};