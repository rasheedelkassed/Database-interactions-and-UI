var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'elkasser',
  password: '8472',
  database: 'student'
});

module.exports.pool = pool;