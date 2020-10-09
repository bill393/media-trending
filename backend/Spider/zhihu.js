/**
 * @file 知乎爬虫
 */

const http = require('Http');
const config = require('config');
const database = require('Database');
const spiderUrl = config.spiderUrl || {};

class ZhihuSpider {
  constructor() {
    this.realtimeHotUrl = spiderUrl.zhihu['热榜'];
  }
  /**
   * 数据插入数据库
   * @param {Array} fields 存储字段列表
   * @param {Array} data 数据列表
   */
  insertData(fields = [], data = []) {
    const query = `INSERT INTO Zhihu(${fields.join(', ')}) VALUES ?`;
    
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
   * 获取热搜榜
   * @param {date} date 
   */
  async getRealtimeHot(date) {
    const realtimeHotList = [];
    const result = await http.get(this.realtimeHotUrl);
    const data = result.data || [];
    data.forEach((item, index) => {
      const target = item.target || {};
      realtimeHotList.push({
        top: index + 1,
        content: target.title,
        url: target.url,
        answerCount: target['answer_count'],
        followCount: target['follower_count'],
        type: 'realtimeHot',
        date
      });
    });
    const fields = ['top', 'content', 'followCount', 'url', 'answerCount', 'type', 'date'];
    this.insertData(fields, realtimeHotList);
  }
  /**
   * 开始爬取
   * @param {date} date 
   */
  start(date) {
    this.getRealtimeHot(date);
  }
};

module.exports = ZhihuSpider;
