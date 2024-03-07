const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'speaky'
});

module.exports = pool;
