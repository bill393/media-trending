/**
 * @file 路由主文件
 */

const express = require('express');
const router = express.Router();
const config = require('config.json');
const routerVersion1 = require('./v1');

router.use(`/${config.versions[0]}`, routerVersion1);

module.exports = router;
