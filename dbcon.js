var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_ahmedhu',
  password        : 'Booya321!',
  database        : 'cs340_ahmedhu'
});
module.exports.pool = pool;
