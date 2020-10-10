/**
 * @file v1路由主文件入口
 */
const express = require('express');
const weibo = require('./weibo');
const database = require('Database');
const router = express.Router();

weibo(router);

router.post('/website', (req, res) => {
  const {name = '', url = ''} = req.body;
  const sql = `INSERT INTO Websites(name, url) VALUES(${name}, ${url})`;
  database.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).send(result);
  });
});

module.exports = router;