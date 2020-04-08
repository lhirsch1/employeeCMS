//build query string based on input

//ex ask which table to update
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    database: employee_db
});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected as id ' + connection.threadID + '\n');
})

var app = express();