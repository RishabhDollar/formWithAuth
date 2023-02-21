const bodyParser = require('body-parser');
const express= require('express');
const app= express();
const mysql= require('mysql2');
app.use(bodyParser.json());

const route= require('./routes/route');
const connection= require('./configs/config');

connection.connect((err)=>{
    if(err) console.log("Error:", err);
    else console.log("MySQL Connection is done..");
});

app.use('/', route);

app.listen(4000, ()=>{
    console.log("Express is listening at 4000..");
});