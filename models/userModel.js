const pg = require('pg');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
};

const pool = new pg.Pool(config);

async function getUserByUsername(username) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows[0];
    } finally {
        client.release();
    };
};

async function insertUser(username, mail, u_password, u_name, u_surname) {
    const client = await pool.connect();
    try {
        await client.query("INSERT INTO users(username, mail, u_password, u_name, u_surname) VALUES ($1, $2, $3, $4, $5)", [username, mail, u_password, u_name, u_surname]);
    } finally {
        client.release();
    };
};

async function getUserByEmail(mail) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE mail = $1", [mail]);
        return result.rows;
    } finally {
        client.release();
    };
};

module.exports = {
    getUserByUsername,
    insertUser,
    getUserByEmail,
};