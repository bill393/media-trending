/**
 * @file 百度爬虫
 */

const http = require('Http');

// var http=require('http');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

class BaiduSpider {
  constructor() {
    this.realtimeHotUrl = new URL(spiderUrl.baidu['实时热点']);
  }
  /**
   * 数据插入数据库
   * @param {Array} fields 存储字段列表
   * @param {Array} data 数据列表
   */
  insertData(fields = [], data = []) {
    const query = `INSERT INTO Baidu(${fields.join(', ')}) VALUES ?`;
    
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
   * 网页格式解码
   * @param {stream} html 网页数据流
   */
  getDecodeHtml(html) {
    return new Promise(res => {
      const chunks = [];
      html.on('data', chunk => {
        chunks.push(chunk);
      });
      html.on('end', () => {
        const result = iconv.decode(Buffer.concat(chunks), 'GB2312');
        res(result.toString());
      });
    });
  }
  /**
   * 根据url获取网页信息
   * @param {string} url 链接
   */
  async getInformations(url) {
    const result = [];
    const html = await http.get(url.href, {
      responseType: 'stream',
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const decodeHtml = await this.getDecodeHtml(html);
    const $ = cheerio.load(decodeHtml);
    const list = $('.mainBody .list-table tbody').find('tr');
    list.each(function () {
      const item = $(this);
      const rankTop = item.find('.first .num-normal').text();
      const rankTopSpec = item.find('.first .num-top').text();
      const rankContent = item.find('.keyword .list-title').text();
      const rankUrl = item.find('.keyword .list-title').attr('href');
      const rankNumber = item.find('.last').text().match(/[0-9]/g);
      result.push({
        top: rankTopSpec || rankTop,
        content: rankContent,
        url: rankUrl,
        number: rankNumber ? Number(rankNumber.join('')) : rankNumber
      })
    });
    return result;
  }
  /**
   * 获取微博热搜榜
   * @param {date} date 时间
   */
  async getRealtimeHot(date) {
    const weiboUrl = this.realtimeHotUrl;
    const informations = await this.getInformations(weiboUrl);
    const realtimeHotList = informations.filter(information => {
      if (information.top !== '') {
        return information;
      }
    }).map(information => {
      information.date = date;
      information.type = 'realtimeHot';
      return information;
    });
    const fields = ['top', 'content', 'number', 'url', 'type', 'date'];
    this.insertData(fields, realtimeHotList);
  }
}

module.exports = BaiduSpider;
