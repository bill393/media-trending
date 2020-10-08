/**
 * @file 主入口文件
 */

const express = require('express');
const cors = require('cors');
const router = require('./Router');
const Spider = require('./Spider');
const config = require('./config.json');
const app = express();

/**
 * 开启服务
 */
app.listen(config.port, () => {
  console.log('http://localhost:8080');
});

app.use(cors());
app.use(config.prefix, router);

const spider = new Spider();
spider.start();

require('./Database');