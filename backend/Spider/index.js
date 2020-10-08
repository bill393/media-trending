/**
 * @file 爬虫主文件入口
 */

const WeiboSpider = require('./weibo');
const BaiduSpider = require('./baidu');
const ZhihuSpider = require('./zhihu');
const GithubSpider = require('./github');
const DoubanSpider = require('./douban');
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
    this.job = new CronJob(spiderConfig.time, () => {
      const date = new Date();
      weiboSpider.getRealtimeHot(date);
      weiboSpider.getSocialEvent(date);
      baiduSpider.getRealtimeHot(date);
      zhihuSpider.getRealtimeHot(date);
      githubSpider.getTrending(date);
      doubanSpider.getRealtimeHot(date);
    });
  }
  start() {
    this.job.start();
  }
};

module.exports = Spider;
