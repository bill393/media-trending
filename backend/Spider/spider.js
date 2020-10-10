/**
 * @file 子进程爬虫
 */

process.on('message', ({id, date, spiders = []}) => {
  console.log(`进程${id}: 开启, 需要处理爬虫数目为${spiders.length} 当前时间: ${date}`);
  let finallyNum = 0;
  spiders.forEach(spiderUrl => {
    const Spider = require(spiderUrl);
    const spider = new Spider();
    spider.start(new Date(date))
      .finally(() => {
        finallyNum++;
        if (finallyNum === spiders.length) {
          console.log(`进程${id}: 完成`);
          process.send({id, status: 'fulfill'});
        }
      });
  });
});
