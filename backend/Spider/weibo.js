/**
 * @file 微博爬虫
 */

const http = require('Http');
const cheerio = require('cheerio');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

class WeiboSpider {
  constructor() {
    this.realtimeHotUrl = new URL(spiderUrl.weibo['实时热搜']);
    this.socialEventUrl = new URL(spiderUrl.weibo['要闻'])
  }
  /**
   * 数据插入数据库
   * @param {Array} fields 存储字段列表
   * @param {Array} data 数据列表
   */
  insertData(fields = [], data = []) {
    const query = `INSERT INTO Weibo(${fields.join(', ')}) VALUES ?`;
    
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
   * @param {URL} url 链接
   */
  async getInformations(url) {
    const result = [];
    const html = await http.get(url.href, {
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const $ = cheerio.load(html);
    const list = $('#pl_top_realtimehot table tbody').find('tr');
    list.each(function () {
      const item = $(this);
      const rankTop = item.find('.ranktop').text();
      const rankContent = JSON.stringify(item.find('.td-02 a').text());
      const rankUrl = url.origin + item.find('.td-02 a').attr('href');
      const rankNumber = item.find('.td-02 span').text();
      result.push({
        top: rankTop,
        content: rankContent,
        url: rankUrl,
        number: rankNumber
      });
    });
    return result;
  }
  /**
   * 获取微博热搜榜
   * @param {date} date 时间
   */
  async getRealtimeHot(date) {
    const realtimeHotList = [];
    const weiboUrl = this.realtimeHotUrl;
    const informations = await this.getInformations(weiboUrl);
    informations.forEach(({top, content, url, number}) => {
      if (top) {
        realtimeHotList.push({
          top: Number(top),
          content,
          url,
          number: Number(number || 0),
          type: 'realtimeHot',
          date
        });
      }
      else {
        realtimeHotList.push({
          content,
          url,
          type: 'topping',
          date
        });
      }
    });

    const fields = ['top', 'content', 'url', 'number', 'type', 'date'];
    this.insertData(fields, realtimeHotList);
  }
  /**
   * 获取微博要闻榜
   * @param {date} date 时间
   */
  async getSocialEvent(date) {
    const socialEventList = [];
    const weiboUrl = this.socialEventUrl;
    const informations = await this.getInformations(weiboUrl);
    informations.forEach(({content, url}) => {
      socialEventList.push({
        content,
        url,
        type: 'socialEvent',
        date
      });
    });

    const fields = ['content', 'url', 'type', 'date'];
    this.insertData(fields, socialEventList);
  }
  /**
   * 开始爬取
   * @param {date} date 
   */
  start(date) {
    return Promise.allSettled([
      this.getRealtimeHot(date),
      this.getSocialEvent(date)
    ]);
  }
}

module.exports = WeiboSpider;
