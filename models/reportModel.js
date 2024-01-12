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

async function getAllReports() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM reports");
        return result.rows;
    } finally {
        client.release();
    };
};

async function getReportById(reportId) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM reports WHERE report_id = $1", [reportId]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function getReportsByUser(userId) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM reports WHERE user_id = $1", [userId]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function userInsertReport(userId, description, location, category, subCategory) {
    const client = await pool.connect();
    try {
        await client.query("INSERT INTO reports(user_id, description, location, category, subcategory) VALUES ($1, $2, $3, $4, $5)", 
        [userId, description, location, category, subCategory]);
    } finally {
        client.release();
    };
};



module.exports = {
    getAllReports,
    getReportById,
    getReportsByUser,
    userInsertReport,
};