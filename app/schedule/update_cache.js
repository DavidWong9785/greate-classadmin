const cmd=require('node-cmd');

module.exports = {
    schedule: {
        cron: '0 0 23 1 */1 *', // 每个月1号的23点，整理redis数据并写入到数据库
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        // 获取redis, 把数据写入到数据库
        await app.redis.get('count').keys("*", async function (err, replies) {
            for (var item of replies) {
                // console.log(await ctx.model.Course.getCourseInfo(item));
                const { student, click, pass, fail } = JSON.parse(await app.redis.get('count').get(item));
                const countId = ctx.helper.getSaltyMd5(item + Date.now() + Math.random()*10000, 'countId');
                await ctx.model.Count.addRedisData(countId, item, student, click, pass, fail, Date.now());
            }
        });
        // 清除redis的数据
        cmd.run('redis-cli -p 6381 -a zjxwl41168751423 flushall');
    },
  };