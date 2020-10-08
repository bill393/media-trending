/**
 * @file 豆瓣爬虫
 */

const http = require('Http');
const cheerio = require('cheerio');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

class DoubanSpider {
  constructor() {
    this.realtimeHotUrl = new URL(spiderUrl.douban['热门话题']);
  }
  /**
   * 数据插入数据库
   * @param {Array} fields 存储字段列表
   * @param {Array} data 数据列表
   */
  insertData(fields = [], data = []) {
    const query = `INSERT INTO Douban(${fields.join(', ')}) VALUES ?`;
    
    database.query(query, [
      data.map(item => {
        const result = [];
        for (const field of fields) {
          if (item[field] === undefined) {
            result.push(null);
          }
          else {
            result.push(item[field]);
          }
        }
        return result;
      })
    ], (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);
    });
  }
  /**
   * 根据url获取网页信息
   * @param {string} url 链接
   */
  async getInformations(url) {
    const result = [];
    const html = await http.get(url.href, {
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const $ = cheerio.load(html);
    const list = $('.trend').find('li');
    list.each(function (i) {
      const item = $(this);
      result.push({
        content: item.find('a').text(),
        url: item.find('a').attr('href'),
        number: item.find('span').text()
      });
    });
    return result;
  }
  /**
   * 获取热榜
   * @param {date} date 
   */
  async getRealtimeHot(date) {
    const informations = await this.getInformations(this.realtimeHotUrl);
    const realtimeHotList = informations.map((information, index) => {
      information.top = index + 1;
      information.type = 'realtimeHot';
      information.date = date;
      return information;
    });
    const fields = ['content', 'url', 'number', 'top', 'type', 'date'];
    this.insertData(fields, realtimeHotList);
  }
}

module.exports = DoubanSpider;
