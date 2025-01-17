// module: a JS file that exports functions and/or variables
// for other JS files to use

const mysql = require('mysql2/promise');

// create a connection pool
// a connection: represents a "pipeline" for commands and responses
// to be sent to the database
// a connection pools manage a pool of connections
// and auto-scale them baed on demand
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;