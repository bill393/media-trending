/**
 * @file bilibili爬虫
 */

const http = require('Http');
const cheerio = require('cheerio');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

class BilibiliSpider {
  constructor() {
    this.rankingUrl = new URL(spiderUrl.bilibili['全站榜']);
    this.animeRankingUrl = new URL(spiderUrl.bilibili['新番榜']);
    this.movieRankingUrl = new URL(spiderUrl.bilibili['影视榜']);
    this.fields = ['top', 'content', 'score', 'url', 'playNumber', 'commentNumber', 'author', 'type', 'date'];
  }
  /**
   * 数据插入数据库
   * @param {Array} fields 存储字段列表
   * @param {Array} data 数据列表
   */
  insertData(fields = [], data = []) {
    const query = `INSERT INTO Bilibili(${fields.join(', ')}) VALUES ?`;
    
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
    const informations = [];
    const html = await http.get(url.href, {
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const $ = cheerio.load(html);
    const list = $('.rank-list').find('li');
    list.each(function () {
      const item = $(this);
      const rankTop = item.find('.num').text();
      const rankScore = item.find('.pts div').text();
      const rankContent = item.find('.content .info a').text();
      const rankUrl = item.find('.content .info a').attr('href');
      const rankDetail = item.find('.content .detail .data-box');
      let rankAuthor = '';
      let rankPlayNumber = '0';
      let rankCommentNumber = '0';
      rankDetail.each(function () {
        const detailItem = $(this);
        const ele = detailItem.find('.b-icon');
        const content = detailItem.text();
        if (ele.hasClass('play')) {
          rankPlayNumber = content;
        }
        else if (ele.hasClass('view')) {
          rankCommentNumber = content;
        }
        else if (ele.hasClass('author')) {
          rankAuthor = content;
        }
      });
      informations.push({
        top: Number(rankTop),
        content: rankContent,
        url: rankUrl,
        playNumber: rankPlayNumber,
        commentNumber: rankCommentNumber,
        author: rankAuthor,
        score: Number(rankScore)
      });
    });
    return informations;
  }
  /**
   * 获取bilibili全站榜
   * @param {date} date 时间
   */
  async getRanking(date) {
    const informations = await this.getInformations(this.rankingUrl);
    const rankList = informations.map(information => {
      information.type = 'all';
      information.date = date;
      return information;
    });
    this.insertData(this.fields, rankList);
  }
  /**
   * 获取bilibili新番榜
   * @param {date} date 时间
   */
  async getAnimeRanking(date) {
    const informations = await this.getInformations(this.animeRankingUrl);
    const rankList = informations.map(information => {
      information.type = 'anime';
      information.date = date;
      return information;
    });
    this.insertData(this.fields, rankList);
  }
  /**
   * 获取bilibili影视榜
   * @param {date} date 时间
   */
  async getMovieRanking(date) {
    const informations = await this.getInformations(this.movieRankingUrl);
    const rankList = informations.map(information => {
      information.type = 'movie';
      information.date = date;
      return information;
    });
    this.insertData(this.fields, rankList);
  }
  /**
   * 开始爬取
   * @param {date} date 时间
   */
  start() {
    this.getRanking(date);
    this.getAnimeRanking(date);
    this.getMovieRanking(date);
  }
}

module.exports = BilibiliSpider;
