/**
 * @file 数据库主文件入口
 */

const mysql = require('mysql');
const databaseConfig = require('config.json').database || {};
const connection = mysql.createConnection({
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
  user: databaseConfig.user,
  password: databaseConfig.password
});
connection.connect(err => {
  if (err) {
    console.log('连接数据库错误:', err);
    throw err;
  }
  console.log('连接数据库成功');
});

module.exports = connection;
