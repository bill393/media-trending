/**
 * @file v1路由主文件入口
 */

const express = require('express');
const moment = require('moment');
const database = require('Database');
const router = express.Router();

const dateFormat = 'YYYY-MM-DD';

router.get('/websites', (req, res) => {
  const {size = 10, page = 1} = req.query;
  const now = size * (page - 1);
  const sql = [
    'select count(*) as count from websites;',
    `select * from websites limit ${now},${size};`
  ];
  database.query(sql.join(''), (err, result) => {
    if (err) {
      throw err;
    }
    const count = result[0] ? result[0][0].count : 0;
    const list = result[1] || [];
    res.status(200).send({
      count,
      list
    });
  });
});

router.get('/websites/ranking', (req, res) => {
  const {size = 10, page = 1} = req.query;
  const now = size * (page - 1);
  const sql = [
    'select count(*) as count from websites;',
    `select * from websites limit ${now},${size};`
  ];
  database.query(sql.join(''), async (err, result) => {
    if (err) {
      throw err;
    }
    const count = result[0] ? result[0][0].count : 0;
    const websites = result[1] || [];
    const startTime = moment().format(dateFormat);
    const endTime = moment(startTime).subtract(-1, 'day').format(dateFormat);
    const typeSql = websites.map(website => `select * from Type where websiteId = ${website.id};`);
    const getRankings = (website, types) => new Promise((res, rej) => {
      if (types.length === 0) {
        res([]);
      }
      const sql = types.map(type => `select * from ${website} where type = '${type.type}' and date_format(date, '%Y-%m-%d') between '${startTime}' and '${endTime}' limit 10;`);
      database.query(sql.join(''), (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      });
    });
    const getList = () => new Promise(res => {
      const result = websites.map(website => {
        return {website, rankings: []};
      });
      database.query(typeSql.join(''), async (err, websiteTypes) => {
        if (err) {
          throw err;
        }
        for (const index in websiteTypes) {
          const types = websiteTypes[index];
          const rankings = await getRankings(websites[index].name, types);
          result[index].rankings = rankings.map((ranking, index) => {
            return {
              desc: types[index],
              list: ranking
            };
          });
        }
        res(result);
      });
    });
    const list = await getList();
    res.status(200).send({
      query: {page, size, startTime, endTime},
      count,
      list
    });
  });
});

module.exports = router;
