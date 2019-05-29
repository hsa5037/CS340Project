var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_INSERTUSERNAME',
  password        : 'INSERTPW',
  database        : 'cs340_INSERTUSERNAME'
});
module.exports.pool = pool;
