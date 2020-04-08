var mysql = require("mysql");
var util = require("util");

var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: '',
    database: 'employees_db'
});

// Make connection.
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });
connection.query = util.promisify(connection.query);

module.exports = connection;