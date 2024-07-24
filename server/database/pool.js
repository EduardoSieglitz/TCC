const mysql = require("mysql2"),
    db = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "cliente",
    });
    
module.exports = db;