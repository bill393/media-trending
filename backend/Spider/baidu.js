/**
 * @file 百度爬虫
 */

const http = require('Http');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

class BaiduSpider {
  constructor() {
    this.realtimeHotUrl = new URL(spiderUrl.baidu['实时热点']);
    this.tiebaTopicUrl = new URL(spiderUrl.baidu['贴吧话题榜']);
    this.tiebaRankingUrl = new URL(spiderUrl.baidu['贴吧榜']);
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
  getDecodeHtml(html, decodeType) {
    return new Promise(res => {
      const chunks = [];
      html.on('data', chunk => {
        chunks.push(chunk);
      });
      html.on('end', () => {
        const result = iconv.decode(Buffer.concat(chunks), decodeType);
        res(result.toString());
      });
    });
  }
  /**
   * 获取百度热搜榜的信息
   * @param {URL} url 链接
   */
  async getRealtimeHotInformations(url) {
    const result = [];
    const html = await http.get(url.href, {
      responseType: 'stream',
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const decodeHtml = await this.getDecodeHtml(html, 'GB2312');
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
   * 获取百度贴吧话题榜的信息
   * @param {URL} url
   */
  async getTiebaTopicInformations(url) {
    const informations = [];
    const html = await http.get(url.href, {
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const $ = cheerio.load(html);
    const list = $('.topic-top-list').find('li');
    list.each(function (i) {
      const item = $(this);
      const itemInfo = item.find('.topic-info');
      const rankContent = itemInfo.find('.topic-name a.topic-text').text();
      const rankUrl = itemInfo.find('.topic-name a.topic-text').attr('href');
      const rankNumber = itemInfo.find('.topic-name .topic-num').text();
      const rankDesc = itemInfo.find('.topic-top-item-desc').text();
      informations.push({
        top: Number(i + 1),
        content: rankContent,
        url: rankUrl,
        number: rankNumber,
        description: rankDesc
      });
    });
    return informations;
  }
  /**
   * 获取百度贴吧排行榜的信息
   * @param {URL} url
   */
  async getTiebaRankingInformations(url) {
    const informations = [];
    const html = await http.get(url.href, {
      responseType: 'stream',
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const decodeHtml = await this.getDecodeHtml(html, 'gbk');
    const $ = cheerio.load(decodeHtml);
    const list = $('.sign_rank_table').find('tr.j_rank_row');
    list.each(function (i) {
      const item = $(this);
      const top = item.find('.rank_index .rank_index_icon').text();
      const rankContent = item.find('.forum_name a').text();
      const rankUrl = item.find('.forum_name a').attr('href');
      const rankNumber = item.find('.forum_sign_num').text();
      const rankMember = item.find('.forum_member').text();
      informations.push({
        top: Number(top),
        content: rankContent,
        url: rankUrl,
        number: rankNumber,
        member: rankMember
      });
    });
    return informations;
  }
  /**
   * 获取百度热搜榜
   * @param {date} date 时间
   */
  async getRealtimeHot(date) {
    const informations = await this.getRealtimeHotInformations(this.realtimeHotUrl);
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
  /**
   * 获取百度贴吧话题榜
   * @param {date} date 时间
   */
  async getTiebaTopic(date) {
    const informations = await this.getTiebaTopicInformations(this.tiebaTopicUrl);
    const topicList = informations.map(information => {
      information.type = 'topic';
      information.date = date;
      return information;
    });
    const fields = ['top', 'content', 'number', 'url', 'date', 'type', 'description'];
    this.insertData(fields, topicList);
  }
  /**
   * 获取百度贴吧排行榜
   * @param {date} date 时间
   */
  async getTiebaRanking(date) {
    const informations = await this.getTiebaRankingInformations(this.tiebaRankingUrl);
    const topicList = informations.map(information => {
      information.type = 'tieba';
      information.date = date;
      return information;
    });
    const fields = ['top', 'content', 'number', 'member', 'url', 'date', 'type'];
    this.insertData(fields, topicList);
  }
  /**
   * 开始爬取
   * @param {date} date 日期
   */
  start(date) {
    return Promise.allSettled([
      this.getRealtimeHot(date),
      this.getTiebaTopic(date)
    ]);
  }
}

module.exports = BaiduSpider;
