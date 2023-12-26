const mysql = require('mysql');

function connect() {

    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: 3306
    });

    connection.connect(error => {
        if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
        }
        console.log('Connected to MySQL database');
    });

    return connection;
}

module.exports = connect;