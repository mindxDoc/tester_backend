const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: true,
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}