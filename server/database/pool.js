const mysql = require("mysql2/promise"),
    db = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "pcic",
    });
    
module.exports = db;