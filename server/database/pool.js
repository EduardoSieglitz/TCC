const mysql = require("mysql2"),
    db = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "PCIC",
    });
    
module.exports = db;