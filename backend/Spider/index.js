/**
 * @file 爬虫主文件入口
 */

const cluster = require('cluster');
const CronJob = require('cron').CronJob;
const cpusNum = require('os').cpus().length;
const path = require('path');
const config = require('config');
const spiderConfig = config.spiderConfig;
const spiders = ['./baidu', './bilibili', './douban', './github', './weibo', './zhihu'];

cluster.setupMaster({
  exec: path.resolve(__dirname, './spider.js')
});

class Spider {
  constructor() {
    this.workersStatus = {};
    this.job = new CronJob(spiderConfig.time, () => {
      const date = new Date();
      this.startSpider(date);
    });
  }
  getSpiders(count) {
    const result = {}
    let spidersNum = spiders.length;
    let spidersNumNow = spidersNum;
    let countNow = count;
    let id = 1;
    while (spidersNumNow > 0) {
      const num = Math.ceil(spidersNumNow / countNow);
      const start = spidersNum - spidersNumNow;
      const end = start + num;
      result[id] = spiders.slice(start, end);
      countNow--;
      spidersNumNow = spidersNumNow - num;
      id++;
    }
    return result;
  }
  isAllFulfill() {
    for (let id in this.workersStatus) {
      if (this.workersStatus[id] !== 'fulfill') {
        return false;
      }
    }
    return true;
  }
  startSpider(date) {
    const spiders = this.getSpiders(cpusNum);
    for (let i = 0; i < cpusNum; i++) {
      const worker = cluster.fork();
      const id = i + 1;
      this.workersStatus[id] = spiders[id] === 0 ? 'fulfill' : 'pending';
      worker.send({id, date, spiders: spiders[id]});
      worker.on('message', ({id, status}) => {
        if (status === 'fulfill') {
          console.log(`主进程: 进程${id}已经完成`);
          this.workersStatus[id] = 'fulfill';
          if (this.isAllFulfill()) {
            this.disconnect();
          }
        }
      });
    }
  }
  disconnect() {
    console.log('全部爬取完毕, 回收进程');
    cluster.disconnect();
  }
  start() {
    this.job.start();
  }
}

module.exports = Spider;
