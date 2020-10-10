/**
 * @file 豆瓣爬虫
 */

const http = require('Http');
const cheerio = require('cheerio');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

/**
 * 处理数据
 * @param {string} data 待处理的数据
 */
function resolveData(data = '') {
  return data.replace(/(\n)|(\t)/g, '').trim();
}

class DoubanSpider {
  constructor() {
    this.topicUrl = new URL(spiderUrl.douban['热门话题']);
    this.movieNowPlayingUrl = new URL(spiderUrl.douban['热映榜']);
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
   * 获取豆瓣话题榜
   * @param {URL} url 链接
   */
  async getDoubanTopicInformations(url) {
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
   * 获取豆瓣热映榜
   * @param {URL} url 链接
   */
  async getDoubanMovieNowPlayingInformations(url) {
    const informations = [];
    const html = await http.get(url.href, {
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const $ = cheerio.load(html);
    const list = $('#nowplaying .lists').find('.list-item');
    list.each(function () {
      const item = $(this);
      const img = item.find('.poster img').attr('src');
      const url = item.find('.poster a').attr('href');
      const content = item.find('.stitle a').text();
      const score = item.find('.srating .subject-rate').text();
      informations.push({
        img,
        url,
        content: resolveData(content),
        score
      });
    });
    return informations;
  }
  /**
   * 获取话题榜
   * @param {date} date 
   */
  async getDoubanTopic(date) {
    const informations = await this.getDoubanTopicInformations(this.topicUrl);
    const topicList = informations.map((information, index) => {
      information.top = index + 1;
      information.type = 'realtimeHot';
      information.date = date;
      return information;
    });
    const fields = ['content', 'url', 'number', 'top', 'type', 'date'];
    this.insertData(fields, topicList);
  }
  /**
   * 获取热映榜
   * @param {date} date 时间
   */
  async getDoubanMovieNowPlaying(date) {
    const informations = await this.getDoubanMovieNowPlayingInformations(this.movieNowPlayingUrl);
    const movieNowPlayingList = informations
      .sort((x, y) => {
        const scoreX = x.score;
        const scoreY = y.score;
        if (scoreX === null) {
          return true;
        }
        if (scoreY === null) {
          return false;
        }
        return Number(scoreY) - Number(scoreX);
      })
      .map((information, index) => {
        information.type = 'movieNowPlaying';
        information.date = date;
        information.top = index + 1;
        return information;
      });
    const fields = ['img', 'content', 'url', 'top', 'type', 'date', 'score'];
    this.insertData(fields, movieNowPlayingList);
  }
  /**
   * 开始爬取
   * @param {date} date 时间
   */
  async start(date) {
    return Promise.allSettled([
      this.getDoubanTopic(date),
      this.getDoubanMovieNowPlaying(date)
    ]);
  }
}

module.exports = DoubanSpider;
