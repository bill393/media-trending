/**
 * @file 爬虫主文件入口
 */

const WeiboSpider = require('./weibo');
const BaiduSpider = require('./baidu');
const ZhihuSpider = require('./zhihu');
const GithubSpider = require('./github');
const DoubanSpider = require('./douban');
const BilibiliSpider = require('./bilibili');
const CronJob = require('cron').CronJob;
const config = require('config');
const spiderConfig = config.spiderConfig;

class Spider {
  constructor() {
    const weiboSpider = new WeiboSpider();
    const baiduSpider = new BaiduSpider();
    const zhihuSpider = new ZhihuSpider();
    const githubSpider = new GithubSpider();
    const doubanSpider = new DoubanSpider();
    const bilibiliSpider = new BilibiliSpider();

    this.job = new CronJob(spiderConfig.time, () => {
      const date = new Date();
      weiboSpider.start(date);
      baiduSpider.start(date)
      zhihuSpider.start(date);
      githubSpider.start(date);
      doubanSpider.start(date);
      bilibiliSpider.start(date);
    });
  }
  start() {
    this.job.start();
  }
};

module.exports = Spider;
