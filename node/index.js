const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req,res) => {
    res.send('testando proxy reverso com nginx e node')
})

app.listen(port, ()=> {
    console.log('rodando na porta '+ port)
})