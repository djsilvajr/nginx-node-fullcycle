const express = require('express');
const app = express();
const dbConnection = require('./mysql');
const port = 3000;

// Convert db.query to a Promise
function queryDatabase(query) {
    const db = dbConnection();
    return new Promise((resolve, reject) => {
        db.query(query, (error, results, fields) => {
            db.end(); // End connection after query
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.get('/', async (req, res) => {
    try {
        let results = await queryDatabase('SHOW TABLES LIKE "user_test"');
        console.log('verificando tabela');

        if (isEmpty(results)) {
            console.log('Creating table users');
            await createTable();
            await insertUsers();
        }

        results = await queryDatabase('SELECT * FROM user_test');
        res.send('ending of aplication');


    } catch (error) {
        res.status(500).send('Database query error: ' + error.message);
    }
});

function isEmpty(value) {
    return (
        value === undefined ||
        value === null ||
        value === false ||
        value === 0 ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (value.constructor === Object && Object.keys(value).length === 0)
    );
}

async function createTable() {
    const createTableQuery = `
        CREATE TABLE user_test (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await queryDatabase(createTableQuery);
}

async function insertUsers() {
    const createUsersQuery = `
        INSERT INTO 
            user_test (
                username, 
                email, 
                created_at
            ) VALUES (
                'usrFullcycle', 
                'emailFullcycleChallange@gmail.com', 
                NOW()
            )`;
    await queryDatabase(createUsersQuery);
}

app.listen(port, () => {
    console.log('Running on port ' + port)
})
