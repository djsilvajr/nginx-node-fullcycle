const express = require('express');
const app = express();
const dbConnection = require('./mysql');
const port = 3000;


app.get('/', (req,res) => {

    let user = process.env.DATABASE_HOST
    const db = dbConnection();

    //console.log(db)
    res.send('testing proxy reverse using nginx and node '+ user)
})

app.get('/tables', (req,res) => {

    const db = dbConnection();

    db.query('SHOW TABLES', (error, results, fields) => {
        if (error) {
            res.status(500).send('Database error');
            throw error;
        }

        res.send('Table created:', results);
        db.end();
    });
})

app.post('/create-table', (req,res) => {

    const createTableQuery = `
        CREATE TABLE user_test (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    db.query(createTableQuery, (error, results, fields) => {
        if (error) throw error;
        res.send('Table created:', results);
    });

    db.end();

})

app.listen(port, ()=> {
    console.log('rodando na porta '+ port)
})