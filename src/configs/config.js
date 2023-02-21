const mysql= require('mysql2');
const connection= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Rishabh@Mysql01",
    database:"test"
});

module.exports= connection;