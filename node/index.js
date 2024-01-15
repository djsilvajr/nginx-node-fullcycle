const express = require('express');
const app = express();
const dbConnection = require('./mysql');
const port = 3000;


function queryDatabase(query) {
    const db = dbConnection();
    return new Promise((resolve, reject) => {
        db.query(query, (error, results, fields) => {
            db.end(); 
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


        const html = buildUsersHtml(results)

        res.send(html);

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

function buildUsersHtml(users) {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User List</title>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>Full Cycle Rocks!</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                <!-- User rows will go here -->`
                users.forEach(user => {
                    html += `<tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                    </tr>`
                })
            html += `</tbody>
        </table>
    </body>
    </html>
    `

    return html
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
