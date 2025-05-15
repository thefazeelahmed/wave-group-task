const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clickfit',
    multipleStatements: true
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection; 