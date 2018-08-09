var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs290_elkasser',
  password: '8472',
  database: 'cs290_elkasser'
});

module.exports.pool = pool;