const mysql = require('promise-mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin12',
  database: 'dev'
});

function getConnection() {
  return connection;
}

module.exports = { getConnection };