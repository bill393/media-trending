/**
 * @file github爬虫
 */

const http = require('Http');
const cheerio = require('cheerio');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};
const spiderConfig = config.spiderConfig || {};

/**
 * 处理数据, 去除\n等字符
 * @param {string} data 
 */
function resolveData(data = '') {
  return data.replace(/(\n)|(\t)/g, '').trim();
}
/**
 * 将千位格式转化为number格式
 * @param {number} num 
 */
function resolveNumber(num = '') {
  return num.split(',').join('');
}
/**
 * 处理content
 * @param {string} content 
 */
function resolveContent(content) {
  const arr = content.split('/');
  return {
    author: resolveData(arr[0]),
    project: resolveData(arr[1])
  };
}
/**
 * 处理todayStar
 * @param {string} todayStar 
 */
function resolveTodayStar(todayStar) {
  const target = todayStar.match(/[0-9]/g).join('');
  return target ? Number(target) : target;
}
/**
 * 提取footer信息
 * @param {jquery} $ 
 * @param {jqueryElement} footer 
 */
function getFooterInformation($, footer) {
  const result = {
    todayStar: '0',
    star: '0',
    fork: '0'
  };
  footer.each(function () {
    const item = $(this);
    if (item.find('.octicon-star').html()) {
      const star = resolveData(item.text());
      if (star.indexOf('stars today') !== -1) {
        result.todayStar = star;
      }
      else {
        result.star = star;
      }
    }
    else if (item.find('.octicon-repo-forked').html()) {
      result.fork = resolveData(item.text());
    }
  });
  return result;
}

class GithubSpider {
  constructor() {
    this.trendingUrl = new URL(spiderUrl.github.trending);
  }
  /**
   * 数据插入数据库
   * @param {Array} fields 存储字段列表
   * @param {Array} data 数据列表
   */
  insertData(fields = [], data = []) {
    const query = `INSERT INTO Github(${fields.join(', ')}) VALUES ?`;
    
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
   * 获取排行榜页面信息
   * @param {URL} url 
   */
  async getInformations(url) {
    const result = [];
    const html = await http.get(url.href, {
      headers: {
        'User-Agent': spiderConfig.devices.computer
      }
    });
    const $ = cheerio.load(html);
    const list = $('.explore-pjax-container .Box').find('.Box-row');
    list.each(function (i) {
      const item = $(this);
      const footer = item.find('div.text-gray').children();
      const {star, fork, todayStar} = getFooterInformation($, footer);
      const description = resolveData(item.find('p.text-gray').text());
      const content = resolveData(item.find('.lh-condensed a').text());
      const {project, author} = resolveContent(content);
      result.push({
        top: Number(i + 1),
        project,
        author,
        description,
        todayStar: resolveTodayStar(todayStar),
        star: resolveNumber(star),
        fork: resolveNumber(fork)
      });
    });
    return result;
  }
  /**
   * 获取排行榜
   * @param {date} date 
   */
  async getTrending(date) {
    const informations = await this.getInformations(this.trendingUrl);
    const trendingList  = informations.map(information => {
      information.type = 'trending';
      information.date = date;
      return information;
    });
    const fields = ['project', 'author', 'description', 'star', 'fork', 'date', 'type', 'top'];
    this.insertData(fields, trendingList);
  }
  /**
   * 开始爬取
   * @param {date} date 
   */
  start(date) {
    return Promise.allSettled([this.getTrending(date)]);
  }
}

module.exports = GithubSpider;
