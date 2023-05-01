// Setup connection to database
var mysql = require('mysql');

// Create theconnection pool using specified credentials
var pool = mysql.createPool({
    connectionLimit: 5,
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_cheshirj",
    password: "1980",
    database: "cs340_cheshirj"
});

// Export as pool
module.exports.pool = pool;